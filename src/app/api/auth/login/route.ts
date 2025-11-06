import { NextRequest, NextResponse } from 'next/server';
import { LoginUseCase } from '@/domain/usecases/auth';
import { UserRepository, AuthService } from '@/data';
import { LoginAuthRequest } from '@/domain/entities';

export async function POST(request: NextRequest) {
  try {
    const body: LoginAuthRequest = await request.json();

    const userRepository = new UserRepository();
    const authService = new AuthService();
    const loginUseCase = new LoginUseCase(userRepository, authService);

    const result = await loginUseCase.execute(body);

    const response = NextResponse.json({
      success: true,
      data: result
    });

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}