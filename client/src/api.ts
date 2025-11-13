import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { PartialTask, Task } from './types';

import type { AppRouter } from '@server/src/trpc/trpc';
import { UpdateTask } from '@shared/schemas';

const API_URL = 'http://localhost:4001';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
    }),
  ],
});

export const fetchTasks = async (showCompleted: boolean): Promise<Task[]> => {
  return client.task.getTasks.query({ completed: showCompleted ? true : undefined });
};

// NORMAL REST API CALL
// export const fetchTasks = async (showCompleted: boolean) => {
//   const url = new URL(`/tasks`, API_URL);

//   if (showCompleted) {
//     url.searchParams.set('completed', 'true');
//   }

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error('Failed to fetch tasks');
//   }

//   const tasks = TaskListSchema.parse(await response.json());

//   return tasks;
// };

export const getTask = async (id: string): Promise<Task> => {
  const url = new URL(`/tasks/${id}`, API_URL);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return response.json();
};

export const createTask = async (task: PartialTask): Promise<void> => {
  return client.task.createTask.mutate(task);
};

// export const createTask = async (task: PartialTask): Promise<void> => {
//   const url = new URL('/tasks', API_URL);

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(task),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to create task');
//   }
// };

export const updateTask = async (id: string, task: UpdateTask): Promise<void> => {
  return client.task.updateTask.mutate({ id: Number(id), task })
};

// export const updateTask = async (id: string, task: PartialTask): Promise<void> => {
//   const url = new URL(`/tasks/${id}`, API_URL);

//   const response = await fetch(url, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(task),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update task');
//   }
// };

export const deleteTask = async (id: string): Promise<void> => {
  return client.task.deleteTask.mutate(+id)
};

// export const deleteTask = async (id: string): Promise<void> => {
//   const url = new URL(`/tasks/${id}`, API_URL);

//   const response = await fetch(url, {
//     method: 'DELETE',
//   });

//   if (!response.ok) {
//     throw new Error('Failed to delete task');
//   }
// };
