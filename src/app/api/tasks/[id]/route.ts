import { NextRequest, NextResponse } from 'next/server';
import { GetTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase } from '@/domain/usecases/tasks';
import { TaskRepository, AuthService } from '@/data';
import { UpdateTaskRequest } from '@/domain/entities';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const taskRepository = new TaskRepository();
    const getTaskUseCase = new GetTaskUseCase(taskRepository);

    const task = await getTaskUseCase.execute(id, userId);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const body: UpdateTaskRequest = await request.json();

    const taskRepository = new TaskRepository();
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

    const task = await updateTaskUseCase.execute(id, userId, body);

    return NextResponse.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);

    if (error instanceof Error && error.message === 'Task not found') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const taskRepository = new TaskRepository();
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

    await deleteTaskUseCase.execute(id, userId);

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);

    if (error instanceof Error && error.message === 'Task not found') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}