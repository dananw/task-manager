import { IUserRepository } from '../../domain/repositories';
import { CreateAuthRequest, User } from '../../domain/entities';
import { prisma } from '../datasource/prisma';

export class UserRepository implements IUserRepository {
  async create(user: CreateAuthRequest): Promise<User> {
    const createdUser = await prisma.user.create({
      data: user
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      password: createdUser.password,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}