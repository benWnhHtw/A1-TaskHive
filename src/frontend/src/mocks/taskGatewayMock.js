import { findMockPerson } from '@/mocks/personGatewayMock'

const STORAGE_KEY = 'taskhive.tasks'

const seedTasks = [
  {
    id: 'task-1',
    title: 'Kueche putzen',
    assigneeName: 'Mira',
    dueDate: '2026-05-22',
    status: 'open',
  },
  {
    id: 'task-2',
    title: 'Muellsaecke rausbringen',
    assigneeName: 'Jonas',
    dueDate: '2026-05-23',
    status: 'open',
  },
  {
    id: 'task-3',
    title: 'Bad kontrollieren',
    assigneeName: 'Lea',
    dueDate: '2026-05-20',
    status: 'done',
  },
]

function readTasks() {
  const storedTasks = localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    writeTasks(seedTasks)
    return seedTasks
  }

  return JSON.parse(storedTasks)
}

function writeTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function waitForMockLatency() {
  return new Promise((resolve) => window.setTimeout(resolve, 250))
}

export function createMockTaskGateway() {
  return {
    async listTasks() {
      await waitForMockLatency()
      return readTasks()
    },

    async createTask(input) {
      await waitForMockLatency()

      const assignee = findMockPerson(input.personId)

      if (!assignee) {
        throw new Error('Person not found')
      }

      const createdTask = {
        id: crypto.randomUUID(),
        title: input.title,
        personId: assignee.id,
        assigneeName: `${assignee.vorname} ${assignee.name}`,
        dueDate: input.dueDate,
        status: 'open',
      }

      const tasks = [createdTask, ...readTasks()]
      writeTasks(tasks)

      return createdTask
    },

    async updateTask(id, input) {
      await waitForMockLatency()

      const tasks = readTasks()
      const task = tasks.find((currentTask) => currentTask.id === id)

      if (!task) {
        throw new Error('Task not found')
      }

      const updatedTask = {
        ...task,
        status: input.status,
      }

      writeTasks(tasks.map((currentTask) => (currentTask.id === id ? updatedTask : currentTask)))

      return updatedTask
    },
  }
}
