import { cookies } from 'next/headers';

export async function getUserIdFromToken(): Promise<string | null> {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { AuthService } = await import('@/data');
    const authService = new AuthService();
    return await authService.verifyToken(token);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}