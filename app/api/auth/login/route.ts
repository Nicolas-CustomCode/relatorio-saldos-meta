import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: 'Configuração do servidor inválida' }, { status: 500 });
    }

    if (username === validUsername && password === validPassword) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
      const alg = 'HS256';

      const token = await new SignJWT({ user: username })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('24h') // Expira em 1 dia
        .sign(secret);

      const response = NextResponse.json({ success: true }, { status: 200 });

      // Configura o cookie HTTP-only
      response.cookies.set('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 dia em segundos
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Erro ao processar login' }, { status: 500 });
  }
}
