import { User, Task, CreateTaskRequest, UpdateTaskRequest, CreateAuthRequest, AuthResponse } from '../entities';

export interface IUserRepository {
  create(user: CreateAuthRequest): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export interface ITaskRepository {
  create(task: CreateTaskRequest & { userId: string }): Promise<Task>;
  findById(id: string, userId: string): Promise<Task | null>;
  findByUserId(userId: string, status?: string): Promise<Task[]>;
  update(id: string, userId: string, data: UpdateTaskRequest): Promise<Task>;
  delete(id: string, userId: string): Promise<void>;
}