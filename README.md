# Exemplo de Projeto React usando Reducer - Notas de aula de 2025

## Informações gerais

- **Objetivo**: Gerenciar (inicializar, atualizar, apagar, etc) estado (_state_) complexo em aplicações React
- **Público alvo**: alunos da disciplina de POS (Programação Orientada a Serviços) do curso de Infoweb (Técnico Integrado em Informática para Internet) no CNAT-IFRN (Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte - Campus Natal-Central)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)

---
## Sumário

- Pré-requisitos
1. Passo 1: Criar o projeto Next.js
2. Passo 2: Configurar shadcn/ui
3. Passo 3: Estrutura do projeto
4. Passo 4: Definir tipos (src/types/task.ts)
5. Passo 5: Criar o reducer (src/lib/tasksReducer.ts)
6. Passo 6: Criar o componente AddTask (src/components/AddTask.tsx)
7. Passo 7: Criar o componente TaskList (src/components/TaskList.tsx)
8. Passo 8: Criar o componente TaskForm (src/components/TaskForm.tsx)
9. Passo 9: Criar a página de lista (src/app/todos/page.tsx)
10. Passo 10: Criar a página de edição (src/app/todos/edit/[id]/page.tsx)
11. Passo 11: Adicionar Toaster Provider (app/layout.tsx)
12. Passo 12: Executar a aplicação
13. Melhorias Possíveis / Desafios

## Links

- [React](https://react.dev/learn)
  - [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [shadcn ui](https://ui.shadcn.com/)

---
## Pré-requisitos
- Node.js instalado
- Conhecimento básico de React e TypeScript

## Passo 1: Criar o projeto Next.js

```bash
npx create-next-app@latest todo-reducer --typescript --tailwind --eslint
cd todo-reducer
```

## Passo 2: Configurar shadcn/ui

```bash
npx shadcn-ui@latest init
```

Escolha as opções padrão (TypeScript, estilo default) e depois adicione os componentes necessários:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add use-toast
```

## Passo 3: Estrutura do projeto

```
src/
  app/
    todos/
      page.tsx        # Página de lista
      edit/
        [id]/
          page.tsx    # Página de edição
  components/
    TaskList.tsx
    TaskForm.tsx
    AddTask.tsx
  lib/
    tasksReducer.ts   # Nosso reducer
  types/
    task.ts          # Tipos TypeScript
```

## Passo 4: Definir tipos (src/types/task.ts)

```typescript
export interface Task {
  id: number;
  text: string;
  done: boolean;
}

export type TasksAction =
  | { type: 'added'; id: number; text: string }
  | { type: 'changed'; task: Task }
  | { type: 'deleted'; id: number };
```

## Passo 5: Criar o reducer (src/lib/tasksReducer.ts)

```typescript
import { Task, TasksAction } from '@/types/task';

export function tasksReducer(tasks: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + JSON.stringify(action));
    }
  }
}
```

## Passo 6: Criar o componente AddTask (src/components/AddTask.tsx)

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dispatch, useState } from 'react';
import { TasksAction } from '@/types/task';

export function AddTask({ dispatch }: { dispatch: Dispatch<TasksAction> }) {
  const [text, setText] = useState('');

  function handleAddTask() {
    if (text.trim()) {
      dispatch({
        type: 'added',
        id: Date.now(),
        text: text,
      });
      setText('');
    }
  }

  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
      />
      <Button onClick={handleAddTask}>Add</Button>
    </div>
  );
}
```

## Passo 7: Criar o componente TaskList (src/components/TaskList.tsx)

```typescript
'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dispatch } from 'react';
import { TasksAction, Task } from '@/types/task';

export function TaskList({
  tasks,
  dispatch,
}: {
  tasks: Task[];
  dispatch: Dispatch<TasksAction>;
}) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.done}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: 'changed',
                    task: {
                      ...task,
                      done: Boolean(checked),
                    },
                  })
                }
              />
              <Label
                htmlFor={`task-${task.id}`}
                className={task.done ? 'line-through' : ''}
              >
                {task.text}
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href={`/todos/edit/${task.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() =>
                dispatch({
                  type: 'deleted',
                  id: task.id,
                })
              }
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

## Passo 8: Criar o componente TaskForm (src/components/TaskForm.tsx)

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Dispatch, useEffect, useState } from 'react';
import { TasksAction, Task } from '@/types/task';

export function TaskForm({
  task,
  tasks,
  dispatch,
}: {
  task?: Task;
  tasks: Task[];
  dispatch: Dispatch<TasksAction>;
}) {
  const [text, setText] = useState(task?.text || '');
  const [done, setDone] = useState(task?.done || false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (task) {
      setText(task.text);
      setDone(task.done);
    }
  }, [task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Task text cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    if (task) {
      // Update existing task
      dispatch({
        type: 'changed',
        task: {
          id: task.id,
          text,
          done,
        },
      });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } else {
      // Add new task
      dispatch({
        type: 'added',
        id: Date.now(),
        text,
      });
      toast({
        title: 'Success',
        description: 'Task added successfully',
      });
    }

    router.push('/todos');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="task-text">Task</Label>
        <Input
          id="task-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>
      {task && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="task-done"
            checked={done}
            onCheckedChange={(checked) => setDone(Boolean(checked))}
          />
          <Label htmlFor="task-done">Completed</Label>
        </div>
      )}
      <Button type="submit">{task ? 'Update Task' : 'Add Task'}</Button>
    </form>
  );
}
```

## Passo 9: Criar a página de lista (src/app/todos/page.tsx)

```typescript
'use client';

import { useReducer } from 'react';
import { tasksReducer } from '@/lib/tasksReducer';
import { AddTask } from '@/components/AddTask';
import { TaskList } from '@/components/TaskList';
import { Task } from '@/types/task';

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
```

## Passo 10: Criar a página de edição (src/app/todos/edit/[id]/page.tsx)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { tasksReducer } from '@/lib/tasksReducer';
import { Task } from '@/types/task';

const initialTasks: Task[] = [
  { id: 1, text: 'Learn React', done: true },
  { id: 2, text: 'Learn Next.js', done: false },
  { id: 3, text: 'Build a todo app', done: false },
];

export default function EditTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  const task = params.id !== 'new' 
    ? tasks.find((t) => t.id === Number(params.id))
    : undefined;

  if (params.id !== 'new' && !task) {
    router.push('/todos');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">
        {task ? 'Edit Task' : 'Add New Task'}
      </h1>
      <TaskForm task={task} tasks={tasks} dispatch={dispatch} />
    </div>
  );
}
```

## Passo 11: Adicionar Toaster Provider (app/layout.tsx)

```typescript
import { Toaster } from '@/components/ui/toaster';
// ... outros imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## Passo 12: Executar a aplicação

```bash
npm run dev
```

Acesse http://localhost:3000/todos para ver a aplicação em ação.

## Fluxo da Aplicação

1. **Página principal (/todos)**:
   - Lista todas as tarefas
   - Permite adicionar novas tarefas
   - Permite marcar tarefas como concluídas
   - Permite deletar tarefas
   - Botão "Edit" leva para a página de edição

2. **Página de edição (/todos/edit/[id])**:
   - Para tarefas existentes: mostra o formulário preenchido
   - Para novas tarefas: mostra formulário vazio
   - Atualiza o estado global via reducer

---
## Melhorias Possíveis / Desafios

1. Adicionar persistência no localStorage
2. Implementar uma API backend
3. Adicionar animações entre estados
4. Implementar testes
5. Adicionar filtros (todos/ativos/concluídos)

Este tutorial foi construído by [deepseek](https://chat.deepseek.com/)
