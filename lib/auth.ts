'use client';
export type AppRole = 'citizen' | 'government' | 'university' | 'industry';
const key='sahaay-auth-session';
export function dashboardFor(role:AppRole) { return `/dashboard/${role}`; }
export function getSession():{role:AppRole;authenticatedAt:number}|null { if(typeof window==='undefined')return null;try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;} }
export function signIn(role:AppRole) { localStorage.setItem(key,JSON.stringify({role,authenticatedAt:Date.now()})); }
export function signOut() { localStorage.removeItem(key); }
