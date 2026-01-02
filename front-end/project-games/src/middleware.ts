import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/access-denied' &&
    !pathname.startsWith('/api/admin')
  ) {
    const adminKey = request.cookies.get('admin_key')?.value;


    const expectedKey = process.env.ADMIN_SECRET_KEY;


    if (!expectedKey) {
      console.error('ADMIN_SECRET_KEY não configurada no servidor');
      return NextResponse.redirect(new URL('/admin/access-denied', request.url));
    }

    if (!adminKey || adminKey.trim() !== expectedKey.trim()) {
      return NextResponse.redirect(new URL('/admin/access-denied', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
