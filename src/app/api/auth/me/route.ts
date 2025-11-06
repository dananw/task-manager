import { NextRequest, NextResponse } from 'next/server';
import { GetUserUseCase } from '@/domain/usecases/auth';
import { UserRepository, AuthService } from '@/data';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const authService = new AuthService();
    const userId = await authService.verifyToken(token);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userRepository = new UserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);

    const user = await getUserUseCase.execute(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}