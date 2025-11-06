import { NextRequest, NextResponse } from 'next/server';
import { CreateTaskUseCase, GetTasksUseCase } from '@/domain/usecases/tasks';
import { TaskRepository, AuthService } from '@/data';
import { CreateTaskRequest } from '@/domain/entities';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const taskRepository = new TaskRepository();
    const getTasksUseCase = new GetTasksUseCase(taskRepository);

    const tasks = await getTasksUseCase.execute(userId, status);

    return NextResponse.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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

    const body: CreateTaskRequest = await request.json();

    const taskRepository = new TaskRepository();
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);

    const task = await createTaskUseCase.execute({
      ...body,
      userId
    });

    return NextResponse.json({
      success: true,
      data: { task }
    }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}