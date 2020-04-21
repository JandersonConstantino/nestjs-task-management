import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { TaskRepository } from './task.repository'
import { Task } from './task.entity'
import { TaskStatus } from './task-status.enum'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto)
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto
  //   let tasks: Task[] = this.getAllTasks()

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task =>
  //       task.title.includes(search) ||
  //       task.description.includes(search)
  //     )
  //   }

  //   return tasks
  // }

  async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id)

    if (!task) {
      throw new NotFoundException('Not found task with this ID')
    }

    return task
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto)
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.getById(id)
    await this.taskRepository.delete(task)
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getById(id)
    task.status = status
    await task.save()

    return task
  }

  // updateStatus(id: Task['id'], status: TaskStatus): Task {
  //   const task = this.getById(id)
  //   task.status = status

  //   return task
  // }
}
