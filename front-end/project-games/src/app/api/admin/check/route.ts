import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminKey = cookieStore.get('admin_key')?.value;

    if (!adminKey) {
      return NextResponse.json({ valid: false });
    }

    // Obter a chave esperada do ambiente do servidor
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedKey) {
      return NextResponse.json({ valid: false });
    }

    // Comparar as chaves (com trim para consistência)
    if (adminKey.trim() !== expectedKey.trim()) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
