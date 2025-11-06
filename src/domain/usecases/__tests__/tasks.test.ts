import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CreateTaskUseCase,
  GetTasksUseCase,
  GetTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase
} from '../tasks';
import { ITaskRepository } from '../../repositories';
import { CreateTaskRequest, UpdateTaskRequest, Task, TaskStatus } from '../../entities';

describe('Task Use Cases', () => {
  let mockTaskRepository: ITaskRepository;
  const userId = 'user123';
  const taskId = 'task123';

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('CreateTaskUseCase', () => {
    it('should create a new task with TODO status', async () => {
      const taskData: CreateTaskRequest & { userId: string } = {
        title: 'Test Task',
        description: 'Test Description',
        userId
      };

      const createdTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      const createTaskUseCase = new CreateTaskUseCase(mockTaskRepository);
      const result = await createTaskUseCase.execute(taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        userId,
        status: TaskStatus.TODO
      });
      expect(result).toEqual(createdTask);
    });
  });

  describe('GetTasksUseCase', () => {
    it('should get all tasks for user', async () => {
      const tasks: Task[] = [
        {
          id: taskId,
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId
        }
      ];

      mockTaskRepository.findByUserId.mockResolvedValue(tasks);

      const getTasksUseCase = new GetTasksUseCase(mockTaskRepository);
      const result = await getTasksUseCase.execute(userId);

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(userId, undefined);
      expect(result).toEqual(tasks);
    });

    it('should get tasks filtered by status', async () => {
      const status = TaskStatus.IN_PROGRESS;
      const tasks: Task[] = [
        {
          id: taskId,
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.IN_PROGRESS,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId
        }
      ];

      mockTaskRepository.findByUserId.mockResolvedValue(tasks);

      const getTasksUseCase = new GetTasksUseCase(mockTaskRepository);
      const result = await getTasksUseCase.execute(userId, status);

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(userId, status);
      expect(result).toEqual(tasks);
    });
  });

  describe('GetTaskUseCase', () => {
    it('should get a specific task', async () => {
      const task: Task = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      };

      mockTaskRepository.findById.mockResolvedValue(task);

      const getTaskUseCase = new GetTaskUseCase(mockTaskRepository);
      const result = await getTaskUseCase.execute(taskId, userId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId, userId);
      expect(result).toEqual(task);
    });

    it('should return null if task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const getTaskUseCase = new GetTaskUseCase(mockTaskRepository);
      const result = await getTaskUseCase.execute(taskId, userId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId, userId);
      expect(result).toBeNull();
    });
  });

  describe('UpdateTaskUseCase', () => {
    it('should update a task successfully', async () => {
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task',
        status: TaskStatus.DONE
      };

      const existingTask: Task = {
        id: taskId,
        title: 'Original Task',
        description: 'Original Description',
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      };

      const updatedTask: Task = {
        ...existingTask,
        title: 'Updated Task',
        status: TaskStatus.DONE,
        updatedAt: new Date()
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
      const result = await updateTaskUseCase.execute(taskId, userId, updateData);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId, userId);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, userId, updateData);
      expect(result).toEqual(updatedTask);
    });

    it('should throw error if task not found', async () => {
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task'
      };

      mockTaskRepository.findById.mockResolvedValue(null);

      const updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);

      await expect(updateTaskUseCase.execute(taskId, userId, updateData))
        .rejects.toThrow('Task not found');
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('DeleteTaskUseCase', () => {
    it('should delete a task successfully', async () => {
      const existingTask: Task = {
        id: taskId,
        title: 'Task to delete',
        description: 'Description',
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.delete.mockResolvedValue();

      const deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
      await deleteTaskUseCase.execute(taskId, userId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId, userId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId, userId);
    });

    it('should throw error if task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);

      await expect(deleteTaskUseCase.execute(taskId, userId))
        .rejects.toThrow('Task not found');
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });
  });
});