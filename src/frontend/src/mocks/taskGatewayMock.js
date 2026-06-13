const STORAGE_KEY = 'taskhive.tasks'

const seedTasks = [
  {
    id: 'task-1',
    titel: 'Kueche putzen',
    beschreibung: 'Arbeitsflaechen reinigen und Muell rausbringen',
    faelligkeitsdatum: '2026-05-22',
    status: 'OFFEN',
  },
  {
    id: 'task-2',
    titel: 'Muellsaecke rausbringen',
    beschreibung: 'Restmuell und Verpackungen in die Tonnen bringen',
    faelligkeitsdatum: '2026-05-23',
    status: 'OFFEN',
  },
  {
    id: 'task-3',
    titel: 'Bad kontrollieren',
    beschreibung: 'Waschbecken, Dusche und Boden pruefen',
    faelligkeitsdatum: '2026-05-20',
    status: 'ERLEDIGT',
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

      const createdTask = {
        id: crypto.randomUUID(),
        titel: input.titel,
        beschreibung: input.beschreibung,
        faelligkeitsdatum: input.faelligkeitsdatum,
        status: input.status,
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
