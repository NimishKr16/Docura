import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || "";
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const url = new URL(req.url)
  const documentId = url.searchParams.get('documentId')

  if (!documentId) {
    return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  let docQuery;
  if (!user || userError) {
    // Not authenticated, only public documents
    docQuery = supabase
      .from('Document')
      .select('isPublic, shareToken')
      .eq('id', documentId)
      .eq('isPublic', true)
      .single();
  } else {
    // Authenticated, allow if public or owner
    docQuery = supabase
      .from('Document')
      .select('isPublic, shareToken, ownerId')
      .eq('id', documentId)
      .or(`isPublic.eq.true,ownerId.eq.${user.id}`)
      .single();
  }
  const { data: doc, error } = await docQuery;

  if (error || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const { isPublic, shareToken } = doc

  return NextResponse.json({
    isPublic,
    shareUrl: isPublic ? `${process.env.NEXT_PUBLIC_APP_URL}/document/by-token?token=${shareToken}` : null
  })
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || "";
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const { documentId, enable, role } = await req.json()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ownerId = user.id;

  // Verify ownership
  const { data: doc, error } = await supabase
    .from('Document')
    .select('ownerId, shareToken')
    .eq('id', documentId)
    .single()

  if (error || !doc || doc.ownerId !== ownerId) {
    return NextResponse.json({ error: 'Only the owner can modify sharing settings' }, { status: 403 })
  }

  let shareToken = doc.shareToken

  if (enable) {
    if (!shareToken) {
      shareToken = crypto.randomBytes(16).toString('hex')
    }
    await supabase
      .from('Document')
      .update({ isPublic: true, shareToken })
      .eq('id', documentId)
  } else {
    console.log("SHARE TOKEN WAS NULL")
    shareToken = null
    await supabase
      .from('Document')
      .update({ isPublic: false, shareToken: null })
      .eq('id', documentId);
  }
  console.log("SHARE TOKEN AFTER NULL CHECK:", shareToken);

  return NextResponse.json({
    success: true,
    shareUrl: enable ? `${process.env.NEXT_PUBLIC_APP_URL}/document/by-token?token=${shareToken}` : null
  })
}