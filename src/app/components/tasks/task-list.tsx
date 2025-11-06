"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskForm } from "./task-form";
import { Task, TaskStatus } from "@/domain/entities";
import { Calendar, Edit2, Trash2, Loader2, Circle, Clock, MoreHorizontal, CheckCircle2, CircleDot } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onTaskChange: () => void;
}

const statusColors = {
  [TaskStatus.TODO]: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200",
  [TaskStatus.IN_PROGRESS]: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200",
  [TaskStatus.DONE]: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-200",
};

const statusIconColors = {
  [TaskStatus.TODO]: "text-yellow-600 dark:text-yellow-500",
  [TaskStatus.IN_PROGRESS]: "text-blue-600 dark:text-blue-500",
  [TaskStatus.DONE]: "text-green-600 dark:text-green-500",
};

const statusBgColors = {
  [TaskStatus.TODO]: "bg-yellow-100 dark:bg-yellow-900/20",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 dark:bg-blue-900/20",
  [TaskStatus.DONE]: "bg-green-100 dark:bg-green-900/20",
};

const statusLabels = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onTaskChange,
}: TaskListProps) {
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        onTaskChange();
      } else {
        console.error("Delete error:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        onTaskChange();
      } else {
        console.error("Status update error:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks efficiently and stay productive
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">
                <div className="flex items-center space-x-2">
                  <CircleDot className="h-4 w-4" />
                  <span>All Tasks</span>
                </div>
              </SelectItem>
              <SelectItem value={TaskStatus.TODO}>
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4" />
                  <span>To Do</span>
                </div>
              </SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>In Progress</span>
                </div>
              </SelectItem>
              <SelectItem value={TaskStatus.DONE}>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Done</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <TaskForm onSuccess={onTaskChange}>
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Edit2 className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </TaskForm>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${statusBgColors[TaskStatus.TODO]} mb-4`}>
              <Circle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filter === "All" ? "No tasks yet" : `No ${filter.toLowerCase()} tasks`}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {filter === "All"
                ? "Create your first task to get started with your productivity journey!"
                : `There are no tasks with status "${filter}". Try changing the filter or create a new task.`}
            </p>
            <TaskForm onSuccess={onTaskChange}>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Edit2 className="mr-2 h-4 w-4" />
                Create Your First Task
              </Button>
            </TaskForm>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${statusBgColors[task.status]} flex-shrink-0`}>
                        {task.status === TaskStatus.TODO && <Circle className="h-3 w-3" />}
                        {task.status === TaskStatus.IN_PROGRESS && <Clock className="h-3 w-3" />}
                        {task.status === TaskStatus.DONE && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                          {task.title}
                        </CardTitle>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {updatingTaskId === task.id ? (
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-muted">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Updating...</span>
                        </div>
                      ) : (
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            handleStatusChange(task.id, value as TaskStatus)
                          }
                          disabled={updatingTaskId === task.id}
                        >
                          <SelectTrigger className={`w-[180px] border-2 ${statusColors[task.status]}`}>
                            <div className="flex items-center space-x-2">
                              <Circle
                                className={`h-3 w-3 fill-current ${statusIconColors[task.status]}`}
                              />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>
                              <div className="flex items-center space-x-2">
                                <Circle className="h-4 w-4 text-yellow-600" />
                                <span>To Do</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span>In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={TaskStatus.DONE}>
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Done</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskForm task={task} onSuccess={onTaskChange}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TaskForm>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
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
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {deletingTaskId === task.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {task.description && (
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {task.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
