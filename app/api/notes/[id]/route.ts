import { NextResponse } from 'next/server'
import Note from '@/models/Note'
import { connectToDB } from '@/lib/mongodb'

type Params = { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const { title, content } = body || {};
  if (!title || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  await connectToDB();
  const updated = await Note.findByIdAndUpdate(
    params.id,
    { title: title.trim(), content: content || '' },
    { new: true }
  );
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  await connectToDB();
  const deleted = await Note.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
