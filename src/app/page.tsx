'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationHeader } from './components/navigation-header';
import { TaskList } from './components/tasks/task-list';
import { Task } from './domain/entities';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, filter]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const result = await response.json();

      if (result.success) {
        setUser(result.data.user);
      } else {
        router.push('/auth');
      }
    } catch (error) {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?status=${filter}`);
      const result = await response.json();

      if (result.success) {
        setTasks(result.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleTaskChange = () => {
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onTaskChange={handleTaskChange}
        />
      </main>
    </div>
  );
}
