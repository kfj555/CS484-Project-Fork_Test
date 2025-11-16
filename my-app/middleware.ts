import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const verified = request.cookies.get('is_uic_verified')?.value === 'true';

  if (!verified) {
    const url = request.nextUrl.clone();
    url.pathname = '/verify';
    url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/graph/:path*',
    '/easyCourses/:path*',
  ],
};
