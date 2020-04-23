import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { GetTasksFilterDto } from './dto'
import { User } from '../auth/user.entity'
import { TaskStatus } from './task-status.enum'

const mockUser = new User()
mockUser.id = 333
mockUser.username = 'Mock User'

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn()
})

describe('TasksService', () => {
  let tasksService: TasksService
  let taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ],
    }).compile()

    tasksService = module.get<TasksService>(TasksService)
    taskRepository = module.get<TaskRepository>(TaskRepository)
  })

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue([])

      const filter: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search queryF'
      }

      const result = await tasksService.getTasks(filter, mockUser)

      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
    })
  })

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and succesffuly retrieve and return the task', async () => {
      const mockTask = { id: 1, title: 'Example 01', description: 'My Description' }
      taskRepository.findOne.mockResolvedValue(mockTask)

      const result = await tasksService.getById(1, mockUser)

      expect(result).toEqual(mockTask)
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1)
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id }
      })
    })

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null)
      const get = tasksService.getById(222, mockUser)
      expect(get).rejects.toThrow(NotFoundException)
    })
  })
})
