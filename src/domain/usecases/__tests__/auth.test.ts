import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignupUseCase, LoginUseCase, GetUserUseCase } from '../auth';
import { IUserRepository } from '../../repositories';
import { IAuthService } from '../interfaces';
import { CreateAuthRequest, LoginAuthRequest, User } from '../../entities';

describe('Auth Use Cases', () => {
  let mockUserRepository: IUserRepository;
  let mockAuthService: IAuthService;

  beforeEach(() => {
    mockUserRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
    };

    mockAuthService = {
      hashPassword: vi.fn(),
      comparePassword: vi.fn(),
      generateToken: vi.fn(),
      verifyToken: vi.fn(),
    };
  });

  describe('SignupUseCase', () => {
    it('should create a new user successfully', async () => {
      const signupData: CreateAuthRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser: User = {
        id: 'user123',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockAuthService.generateToken.mockResolvedValue('jwt-token');

      const signupUseCase = new SignupUseCase(mockUserRepository, mockAuthService);
      const result = await signupUseCase.execute(signupData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: hashedPassword
      });
      expect(mockAuthService.generateToken).toHaveBeenCalledWith('user123');

      expect(result).toEqual({
        user: {
          id: 'user123',
          email: 'test@example.com',
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt
        },
        token: 'jwt-token'
      });
    });

    it('should throw error if email already exists', async () => {
      const signupData: CreateAuthRequest = {
        email: 'existing@example.com',
        password: 'password123'
      };

      const existingUser: User = {
        id: 'user123',
        email: 'existing@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      const signupUseCase = new SignupUseCase(mockUserRepository, mockAuthService);

      await expect(signupUseCase.execute(signupData)).rejects.toThrow('Email already registered');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('LoginUseCase', () => {
    it('should login user successfully', async () => {
      const loginData: LoginAuthRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateToken.mockResolvedValue('jwt-token');

      const loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService);
      const result = await loginUseCase.execute(loginData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith('user123');

      expect(result).toEqual({
        user: {
          id: 'user123',
          email: 'test@example.com',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token: 'jwt-token'
      });
    });

    it('should throw error if user does not exist', async () => {
      const loginData: LoginAuthRequest = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      const loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService);

      await expect(loginUseCase.execute(loginData)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error if password is incorrect', async () => {
      const loginData: LoginAuthRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockAuthService.comparePassword.mockResolvedValue(false);

      const loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService);

      await expect(loginUseCase.execute(loginData)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('GetUserUseCase', () => {
    it('should return user without password', async () => {
      const userId = 'user123';
      const user: User = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findById.mockResolvedValue(user);

      const getUserUseCase = new GetUserUseCase(mockUserRepository);
      const result = await getUserUseCase.execute(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user does not exist', async () => {
      const userId = 'nonexistent-user';

      mockUserRepository.findById.mockResolvedValue(null);

      const getUserUseCase = new GetUserUseCase(mockUserRepository);
      const result = await getUserUseCase.execute(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
});