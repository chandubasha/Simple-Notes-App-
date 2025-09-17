import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const hasEnv = !!process.env.MONGODB_URI;
    await connectToDB();
    return NextResponse.json({ ok: true, env: hasEnv, mongo: 'connected' }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'server error' }, { status: 500 });
  }
}
