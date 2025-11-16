import { NextResponse } from 'next/server';
import { getToken, deleteToken } from '@/lib/tokenStore';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body?.email || '').trim();
    const token = (body?.token || '').trim();

    if (!email || !token) {
      return NextResponse.json({ ok: false, error: 'Email and token required' }, { status: 400 });
    }

    const rec = getToken(email);
    if (!rec || rec.token !== token) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    // Invalidate the token
    deleteToken(email);

    const res = NextResponse.json({ ok: true });
    res.cookies.set('is_uic_verified', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Verification failed' }, { status: 500 });
  }
}
