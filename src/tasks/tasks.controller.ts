import { Controller, Get, Post, Body, Param, Delete, Res, Patch, Query } from '@nestjs/common'
import { Response } from 'express'
import { TasksService } from './tasks.service'
import { Task } from './tasks.model'
import { CreateTaskDto, UpdateTaskStatusDto, GetTasksFilterDto } from './dto'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
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
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ): Task {
    const { status } = updateTaskStatusDto
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
