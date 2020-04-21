import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Patch,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Response } from 'express'
import { TasksService } from './tasks.service'
import { Task, TaskStatus } from './tasks.model'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  @UsePipes(ValidationPipe)
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      this.tasksService.getTasksWithFilters(filterDto)
    }

    return this.tasksService.getAllTasks()
  }

  @Get(':id')
  getById(@Param('id') id: string): Task {
    return this.tasksService.getById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Task {
    return this.tasksService.updateStatus(id, status)
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Res() response: Response
  ): void {
    this.tasksService.deleteTask(id);
    response.status(201).send()
  }
}
