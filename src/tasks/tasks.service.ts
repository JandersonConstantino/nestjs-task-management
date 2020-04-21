import { Injectable } from '@nestjs/common'
import { Task, TaskStatus } from './tasks.model'
import * as uuid from 'uuid/v1'
import { CreateTaskDto, GetTasksFilterDto } from './dto'

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto
    let tasks: Task[] = this.getAllTasks()

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search)
      )
    }

    return tasks
  }

  getById(id: Task['id']): Task {
    return this.tasks.find(task => task.id === id)
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      ...createTaskDto,
      id: uuid(),
      status: TaskStatus.OPEN
    }

    this.tasks.push(task)
    return task
  }

  deleteTask(id: Task['id']): void {
    const updatedTasks = this.tasks.filter(task => task.id !== id)
    this.tasks = updatedTasks
  }

  updateStatus(id: Task['id'], status: TaskStatus): Task {
    const task = this.getById(id)
    task.status = status

    return task
  }
}
