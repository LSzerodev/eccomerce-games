import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger todas as rotas que começam com /admin (exceto /admin/access-denied e rotas de API)
  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/access-denied' &&
    !pathname.startsWith('/api/admin')
  ) {
    // Obter a chave do cookie httpOnly
    const adminKey = request.cookies.get('admin_key')?.value;

    // Obter a chave esperada do ambiente (apenas no servidor)
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    // Se não houver chave esperada configurada, bloquear acesso
    if (!expectedKey) {
      console.error('ADMIN_SECRET_KEY não configurada no servidor');
      return NextResponse.redirect(new URL('/admin/access-denied', request.url));
    }

    // Se não houver chave fornecida ou não corresponder, redirecionar (com trim para consistência)
    if (!adminKey || adminKey.trim() !== expectedKey.trim()) {
      return NextResponse.redirect(new URL('/admin/access-denied', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
