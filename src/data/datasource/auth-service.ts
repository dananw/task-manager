import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../domain/usecases/interfaces';

export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(userId: string): Promise<string> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  }

  async verifyToken(token: string): Promise<string | null> {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}