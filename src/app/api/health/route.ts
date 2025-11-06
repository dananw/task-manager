import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Task Manager API is healthy',
    timestamp: new Date().toISOString()
  });
}