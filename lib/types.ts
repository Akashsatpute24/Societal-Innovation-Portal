export type Role = 'citizen' | 'govt_admin' | 'university' | 'industry_csr';

// High-level domains (supports legacy strings + expanded domain names)
export type Domain = 
  | 'Water Management' 
  | 'Water Resources'
  | 'Agriculture' 
  | 'Agriculture & Soil'
  | 'Healthcare' 
  | 'Public Health & Sanitation'
  | 'Infrastructure' 
  | 'Civil Infrastructure'
  | 'Education'
  | 'Energy & Environment'
  | (string & {}); // Flexible fallback to prevent TypeScript build errors

// Workflow statuses across the 4 portals
export type Status = 
  | 'Submitted' 
  | 'Approved'
  | 'Routed_To_University' 
  | 'In_Development' 
  | 'Completed';

export type Problem = { 
  id: string; 
  title: string; 
  description: string; 
  
  // Geolocation & Spatial Data Fields
  location_lat?: number; 
  location_lng?: number; 
  location_address?: string; // e.g., "Dhanbad, Jharkhand"
  district?: string;         // Used for regional heatmaps & filtering

  media_url?: string; 
  
  // Primary & Deep Technical Domain Taxonomy
  domain: Domain; 
  sub_domain?: string;                 // e.g., "Polymer & Self-Healing Asphalt"
  specific_category_tags?: string[];  // e.g., ["Asphalt", "Monsoon Potholes", "Material Science"]

  urgency_score: number; 
  summary: string; 
  
  // Gemini AI Recommendation Payload
  recommended_university: string; 
  recommended_department: string; 
  ai_matching_reason: string; 
  
  // Assignment & Routing
  status: Status; 
  assigned_university?: string; 
  assigned_department?: string;
  citizen_id?: string;
  created_at: string; 
};

export type Project = { 
  id: string; 
  problem_id: string; 
  title: string; 
  university_name: string; 
  faculty_lead: string; 
  student_team: string; 
  funding_raised: number; 
  funding_target: number; 
  status: string;
  created_at?: string;
};

// User Profile for Supabase RBAC & Authentication
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  institution_name?: string;
};