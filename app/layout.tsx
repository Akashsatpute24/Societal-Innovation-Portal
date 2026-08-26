import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Sahaay | Societal Innovation Portal', description: 'Problems to progress, together.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
