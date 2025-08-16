import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }
  const doc = await prisma.document.findUnique({
    where: { shareToken: token },
  })

  if (!doc || !doc.isPublic) {
    return NextResponse.json({ error: 'Not found or not public' }, { status: 404 })
  }

  return NextResponse.json(doc)
}