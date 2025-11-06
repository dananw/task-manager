'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskStatus } from '@/domain/entities';

interface TaskStatusSelectProps {
  task: Task;
  onStatusChange: () => void;
}

const statusLabels = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done'
};

export function TaskStatusSelect({ task, onStatusChange }: TaskStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        onStatusChange();
      } else {
        console.error('Update error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select value={task.status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusLabels).map(([status, label]) => (
          <SelectItem key={status} value={status}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}