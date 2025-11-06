import { ITaskRepository } from '../../domain/repositories';
import { CreateTaskRequest, UpdateTaskRequest, Task } from '../../domain/entities';
import { prisma } from '../datasource/prisma';

export class TaskRepository implements ITaskRepository {
  async create(task: CreateTaskRequest & { userId: string }): Promise<Task> {
    const createdTask = await prisma.task.create({
      data: task
    });

    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description || undefined,
      status: createdTask.status as any,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt,
      userId: createdTask.userId
    };
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!task) {
      return null;
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as any,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId
    };
  }

  async findByUserId(userId: string, status?: string): Promise<Task[]> {
    const whereClause: any = { userId };

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as any,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId
    }));
  }

  async update(id: string, userId: string, data: UpdateTaskRequest): Promise<Task> {
    const updatedTask = await prisma.task.update({
      where: { id, userId },
      data
    });

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description || undefined,
      status: updatedTask.status as any,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      userId: updatedTask.userId
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.task.delete({
      where: { id, userId }
    });
  }
}