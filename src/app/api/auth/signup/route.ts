import { NextRequest, NextResponse } from 'next/server';
import { SignupUseCase } from '@/domain/usecases/auth';
import { UserRepository, AuthService } from '@/data';
import { CreateAuthRequest } from '@/domain/entities';

export async function POST(request: NextRequest) {
  try {
    const body: CreateAuthRequest = await request.json();

    const userRepository = new UserRepository();
    const authService = new AuthService();
    const signupUseCase = new SignupUseCase(userRepository, authService);

    const result = await signupUseCase.execute(body);

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
    console.error('Signup error:', error);

    if (error instanceof Error && error.message === 'Email already registered') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}