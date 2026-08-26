import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key) : null;
}
export async function POST(request: Request) {
  const client = db();
  if (!client) return NextResponse.json({ demo: true }, { status: 202 });
  const { citizen_id, ...problem } = await request.json();
  if (!citizen_id) return NextResponse.json({ error: 'Authenticated citizen_id required.' }, { status: 401 });
  const { data, error } = await client.from('problems').insert({ citizen_id, ...problem }).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json(data, { status: 201 });
}
