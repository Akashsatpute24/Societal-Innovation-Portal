'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardFor, getSession, type AppRole } from '@/lib/auth';

export default function ProtectedRoute({role,children}:{role:AppRole;children:React.ReactNode}) { const router=useRouter();const [allowed,setAllowed]=useState(false);useEffect(()=>{const session=getSession();if(!session){router.replace('/');return;}if(session.role!==role){router.replace(dashboardFor(session.role));return;}setAllowed(true);},[role,router]);if(!allowed)return <main className="grid min-h-screen place-items-center bg-mist"><p className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-moss shadow-sm">Verifying secure workspace…</p></main>;return <>{children}</>; }
