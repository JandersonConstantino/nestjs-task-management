import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { TaskRepository } from './task.repository'
import { Task } from './task.entity'
import { TaskStatus } from './task-status.enum'
import { User } from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }

  async getById(
    id: number,
    user: User
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id }
    })

    if (!task) {
      throw new NotFoundException('Not found task with this ID')
    }

    return task
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async deleteTask(
    id: number,
    user: User
  ): Promise<void> {
    const task = await this.getById(id, user)
    await this.taskRepository.delete(task)
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.getById(id, user)
    task.status = status
    await task.save()

    return task
  }
}
