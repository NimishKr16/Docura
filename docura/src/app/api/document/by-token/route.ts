import { createServerClient } from '@/lib/supabaseServer'
import { Database } from '@/types/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
  }
  const accessToken = authHeader.replace('Bearer ', '')

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  console.log("token: ",token);

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = createServerClient(accessToken)

  const { data: doc, error } = await supabase
    .from('Document')
    .select('*')
    .eq('shareToken', token)
    .maybeSingle()
  console.log("doc: ",doc);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 })
  }

  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(doc)
}
