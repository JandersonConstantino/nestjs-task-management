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
  ValidationPipe,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'

import { TasksService } from './tasks.service'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { Task } from './task.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  @UsePipes(ValidationPipe)
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    const tasks = await this.tasksService.getTasks(filterDto, user)
    return tasks
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return await this.tasksService.getById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    const task = await this.tasksService.createTask(createTaskDto, user)
    return task
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    const task = await this.tasksService.updateStatus(id, status, user)
    return task
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
    @GetUser() user: User
  ): Promise<void> {
    await this.tasksService.deleteTask(id, user);
    response.status(201).send()
  }
}
