import { IUserRepository } from '../repositories';
import { CreateAuthRequest, LoginAuthRequest, AuthResponse, User } from '../entities';
import { IAuthService } from './interfaces';

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(userId: string): Promise<string>;
  verifyToken(token: string): Promise<string | null>;
}

export class SignupUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(request: CreateAuthRequest): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await this.authService.hashPassword(request.password);
    const user = await this.userRepository.create({
      email: request.email,
      password: hashedPassword
    });

    const token = await this.authService.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(request: LoginAuthRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.authService.comparePassword(request.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = await this.authService.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }
}

export class GetUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}