import { Injectable } from '@nestjs/common';

export type Todo = { id: number; title: string; completed: boolean };

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];

  create(title: string): Todo {
    const todo = { id: this.todos.length + 1, title, completed: false };
    this.todos.push(todo);
    return todo;
  }

  list(): Todo[] {
    return this.todos;
  }
}
