import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Chave de acesso não fornecida' },
        { status: 400 }
      );
    }

    // Obter a chave esperada do ambiente do servidor
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedKey) {
      console.error('ADMIN_SECRET_KEY não configurada no servidor');
      return NextResponse.json(
        { valid: false, error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    // Comparar as chaves (com trim em ambos os lados para consistência)
    if (apiKey.trim() !== expectedKey.trim()) {
      return NextResponse.json(
        { valid: false, error: 'Chave de acesso inválida' },
        { status: 403 }
      );
    }

    // Se a chave for válida, definir cookies
    const cookieStore = await cookies();

    // Cookie httpOnly para validação no middleware
    cookieStore.set('admin_key', apiKey.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    // Cookie não-httpOnly para uso nas requisições ao backend (via cliente)
    cookieStore.set('admin_key_client', apiKey.trim(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return NextResponse.json({
      valid: true,
      message: 'Chave de acesso válida',
    });
  } catch (error: any) {
    console.error('Erro ao validar chave:', error);
    return NextResponse.json(
      { valid: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
