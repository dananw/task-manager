'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TaskForm } from './task-form';
import { Task, TaskStatus } from '@/domain/entities';
import { Calendar, Edit2, Trash2, Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onTaskChange: () => void;
}

const statusColors = {
  [TaskStatus.TODO]: 'bg-yellow-100 text-yellow-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800'
};

const statusLabels = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done'
};

export function TaskList({ tasks, filter, onFilterChange, onTaskChange }: TaskListProps) {
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        onTaskChange();
      } else {
        console.error('Delete error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        onTaskChange();
      } else {
        console.error('Status update error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tasks</SelectItem>
              <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
            </SelectContent>
          </Select>

          <TaskForm onSuccess={onTaskChange}>
            <Button>
              <Edit2 className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </TaskForm>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              {filter === 'All'
                ? 'No tasks yet. Create your first task to get started!'
                : `No tasks with status "${filter}".`
              }
            </p>
            <TaskForm onSuccess={onTaskChange}>
              <Button variant="outline" className="mt-4">
                <Edit2 className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </TaskForm>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {updatingTaskId === task.id ? (
                        <div className="flex items-center space-x-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-sm text-muted-foreground">Updating...</span>
                        </div>
                      ) : (
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                          disabled={updatingTaskId === task.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TaskForm task={task} onSuccess={onTaskChange}>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TaskForm>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={deletingTaskId === task.id}
                          >
                            {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {task.description && (
                <CardContent>
                  <CardDescription>{task.description}</CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}