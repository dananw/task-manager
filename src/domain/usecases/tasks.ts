import { ITaskRepository } from '../repositories';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../entities';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskData: CreateTaskRequest & { userId: string }): Promise<Task> {
    return await this.taskRepository.create({
      ...taskData,
      status: TaskStatus.TODO
    });
  }
}

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(userId: string, status?: string): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId, status);
  }
}

export class GetTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, userId: string): Promise<Task | null> {
    return await this.taskRepository.findById(taskId, userId);
  }
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, userId: string, data: UpdateTaskRequest): Promise<Task> {
    const existingTask = await this.taskRepository.findById(taskId, userId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    return await this.taskRepository.update(taskId, userId, data);
  }
}

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, userId: string): Promise<void> {
    const existingTask = await this.taskRepository.findById(taskId, userId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    await this.taskRepository.delete(taskId, userId);
  }
}