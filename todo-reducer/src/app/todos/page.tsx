'use client';

import { useReducer } from 'react';
import { tasksReducer } from 'src/lib/tasksReducer';
import { AddTask } from 'src/components/AddTask';
import { TaskList } from 'src/components/TaskList';
import { Task } from 'src/types/task';

const initialTasks: Task[] = [
  { id: 1, text: 'Learn React', done: true },
  { id: 2, text: 'Learn Next.js', done: false },
  { id: 3, text: 'Build a todo app', done: false },
];

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Todo List with Reducer</h1>
      <AddTask dispatch={dispatch} />
      <TaskList tasks={tasks} dispatch={dispatch} />
    </div>
  );
}