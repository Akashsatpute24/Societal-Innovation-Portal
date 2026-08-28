'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';
export default function LogoutButton() { const router=useRouter();return <button onClick={()=>{signOut();router.replace('/');}} className="btn bg-ink text-white" aria-label="Logout"><LogOut className="h-4 w-4"/><span className="hidden md:inline">Logout</span></button>; }
