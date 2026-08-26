import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const fallback = { domain: 'Infrastructure', urgency_score: 3, summary: 'A community issue requires coordinated local action.', recommended_university: 'BIT Mesra, Ranchi', recommended_department: 'Department of Civil and Environmental Engineering', ai_matching_reason: 'The team has relevant applied engineering capability.' };
export async function POST(request: Request) {
  const { description, location } = await request.json();
  if (!description?.trim()) return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ ...fallback, ai_matching_reason: 'Demo classification — add GEMINI_API_KEY for live AI matching.' });
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Classify this public issue in Jharkhand. Description: ${description}\nLocation: ${location ? `${location.lat}, ${location.lng}` : 'not shared'}.`, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { domain: { type: Type.STRING, enum: ['Water Management', 'Agrriculture', 'Agriculture', 'Healthcare', 'Infrastructure', 'Education'] }, urgency_score: { type: Type.INTEGER }, summary: { type: Type.STRING }, recommended_university: { type: Type.STRING }, recommended_department: { type: Type.STRING }, ai_matching_reason: { type: Type.STRING } }, required: ['domain', 'urgency_score', 'summary', 'recommended_university', 'recommended_department', 'ai_matching_reason'] } } });
    const result = JSON.parse(response.text || '{}');
    return NextResponse.json({ ...fallback, ...result, domain: result.domain === 'Agrriculture' ? 'Agriculture' : result.domain, urgency_score: Math.min(5, Math.max(1, Number(result.urgency_score) || 3)) });
  } catch { return NextResponse.json({ ...fallback, ai_matching_reason: 'AI is temporarily unavailable; this safe default routing is ready for review.' }); }
}
