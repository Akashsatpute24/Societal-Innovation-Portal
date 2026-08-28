import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UNIVERSITY_REGISTRY } from '../../../lib/universities';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Format universities for Gemini prompt context
const universityContext = UNIVERSITY_REGISTRY.map(u => 
  `- ${u.name} (State: ${u.state}) | Depts: ${u.departments.join(', ')} | Specializations: ${u.specializations.join(', ')}`
).join('\n');

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key) : null;
}

export async function POST(request: Request) {
  const client = db();
  if (!client) return NextResponse.json({ demo: true }, { status: 202 });

  try {
    const { citizen_id, ...problem } = await request.json();

    if (!citizen_id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 1. Call Gemini API to perform AI Triage & University Routing
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an expert triage engineer for the SAHAAY societal R&D platform.
Analyze the citizen report and select the single BEST matching university from our approved list to solve this problem.

APPROVED UNIVERSITIES REGISTER:
${universityContext}

CITIZEN REPORT TITLE: "${problem.title || ''}"
CITIZEN REPORT DESCRIPTION: "${problem.description || ''}"

Instructions:
1. Assign broad 'domain' (e.g., Civil Infrastructure, Water Resources, Agriculture & Soil, Healthcare, Energy & Environment).
2. Assign a specific 'sub_domain' (e.g., Polymer & Self-Healing Asphalt, Groundwater Heavy Metal Toxicity).
3. Rate urgency_score from 1 to 5 based on public health risk, scale, degradation rate, and economic impact.
4. Select the best matching university from the register based on domain expertise and geographic proximity.
5. Select an exact department from that university's listed departments.

Return JSON matching this exact structure:
{
  "domain": "Civil Infrastructure",
  "sub_domain": "Polymer & Self-Healing Asphalt",
  "urgency_score": 4,
  "summary": "Potholes and waterlogging causing traffic hazards.",
  "recommended_university": "National Institute of Technology Karnataka (NITK), Surathkal",
  "recommended_department": "Department of Civil Engineering",
  "ai_matching_reason": "NITK Surathkal specializes in high-rainfall bituminous asphalt and coastal highway durability."
}
`;

    const aiResult = await model.generateContent(prompt);
    const aiData = JSON.parse(aiResult.response.text());

    // 2. Merge AI Analysis results with the Citizen submission data
    const completeProblemData = {
      ...problem,
      citizen_id,
      domain: aiData.domain,
      sub_domain: aiData.sub_domain,
      urgency_score: aiData.urgency_score,
      summary: aiData.summary,
      recommended_university: aiData.recommended_university,
      recommended_department: aiData.recommended_department,
      ai_matching_reason: aiData.ai_matching_reason,
      status: problem.status || 'Submitted',
      created_at: new Date().toISOString()
    };

    // 3. Insert the complete, AI-enhanced problem record into Supabase
    const { data, error } = await client.from('problems').insert(completeProblemData).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] });

  } catch (err: any) {
    console.error("Problem Creation Error:", err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
