export type Role = 'citizen' | 'govt_admin' | 'university' | 'industry_csr';
export type Domain = 'Water Management' | 'Agriculture' | 'Healthcare' | 'Infrastructure' | 'Education';
export type Status = 'Submitted' | 'Routed_To_University' | 'In_Development' | 'Completed';
export type Problem = { id: string; title: string; description: string; location_lat?: number; location_lng?: number; media_url?: string; domain: Domain; urgency_score: number; summary: string; recommended_university: string; recommended_department: string; ai_matching_reason: string; status: Status; assigned_university?: string; created_at: string };
export type Project = { id: string; problem_id: string; title: string; university_name: string; faculty_lead: string; student_team: string; funding_raised: number; funding_target: number; status: string };
