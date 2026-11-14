import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Todo, TodoService } from './todo.service';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todos: TodoService) {}

  @Get()
  @ApiOkResponse({ description: 'Lists todos.' })
  list(): Todo[] {
    return this.todos.list();
  }

  @Post()
  @ApiBody({ schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' } } } })
  @ApiCreatedResponse({ description: 'Creates a todo.' })
  create(@Body('title') title: string): Todo {
    return this.todos.create(title);
  }
}
