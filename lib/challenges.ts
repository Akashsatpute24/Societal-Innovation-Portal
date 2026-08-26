'use client';
import { useEffect, useState } from 'react';

export type ChallengeStatus = 'Submitted' | 'Under Review' | 'Matched' | 'Accepted' | 'In Progress' | 'Resolved';
export type CommunityChallenge = { challengeId:string; title:string; description:string; category:string; severity:'Low'|'Medium'|'High'; location:string; submittedBy:string; createdAt:string; image?:string; voiceTranscript?:string; aiSummary:string; suggestedAction:string; status:ChallengeStatus; targetGovernmentDepartments:string[]; relevantUniversityDomains:string[]; relevantIndustryCSRDomains:string[]; officialResponse?:string; universityInterest?:string; supportOffer?:{organization:string;contact:string;support:string;contribution:string} };
const key='sahaay-community-challenges'; const event='sahaay-challenges-changed';
const mapping:Record<string,{government:string[];university:string[];industry:string[]}>={
 'Water & Sanitation':{government:['Water','Municipal','Public Health'],university:['Environmental Science','Civil Engineering','Chemical Engineering'],industry:['Water','Infrastructure','CSR']},
 'Water Management':{government:['Water','Municipal','Public Health'],university:['Environmental Science','Civil Engineering','Chemical Engineering'],industry:['Water','Infrastructure','CSR']},
 'Agriculture':{government:['Agriculture'],university:['Agriculture','Agri-tech'],industry:['Agri-tech','CSR']},
 'Education':{government:['Education'],university:['Education','Technology'],industry:['Education CSR','CSR']},
 'Sanitation':{government:['Municipal','Sanitation'],university:['Environmental Science','Waste Management'],industry:['Waste Management','CSR']},
 'Infrastructure':{government:['Public Works','Municipal'],university:['Civil Engineering','Urban Planning'],industry:['Infrastructure','CSR']},
};
export function readChallenges():CommunityChallenge[] { if(typeof window==='undefined')return []; try{return JSON.parse(localStorage.getItem(key)||'[]');}catch{return [];} }
function write(items:CommunityChallenge[]) { localStorage.setItem(key,JSON.stringify(items)); window.dispatchEvent(new Event(event)); }
export function createChallenge(input:Omit<CommunityChallenge,'challengeId'|'createdAt'|'targetGovernmentDepartments'|'relevantUniversityDomains'|'relevantIndustryCSRDomains'|'status'>) { const match=mapping[input.category]||mapping['Infrastructure'];const challenge:CommunityChallenge={...input,challengeId:`SH-2026-${String(Date.now()).slice(-5)}`,createdAt:new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}),status:'Submitted',targetGovernmentDepartments:match.government,relevantUniversityDomains:match.university,relevantIndustryCSRDomains:match.industry};write([challenge,...readChallenges()]);return challenge; }
export function updateChallenge(id:string, patch:Partial<CommunityChallenge>) { write(readChallenges().map(x=>x.challengeId===id?{...x,...patch}:x)); }
export function useChallenges() { const [items,setItems]=useState<CommunityChallenge[]>([]);useEffect(()=>{const refresh=()=>setItems(readChallenges());refresh();window.addEventListener(event,refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener(event,refresh);window.removeEventListener('storage',refresh);};},[]);return items; }
