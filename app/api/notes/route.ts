import { NextResponse } from 'next/server'
import Note from '@/models/Note'
import { connectToDB } from '@/lib/mongodb'

export async function GET() {
  await connectToDB();
  const notes = await Note.find().sort({ updatedAt: -1 });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content } = body || {};
  if (!title || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  await connectToDB();
  const note = await Note.create({ title: title.trim(), content: content || '' });
  return NextResponse.json(note, { status: 201 });
}
