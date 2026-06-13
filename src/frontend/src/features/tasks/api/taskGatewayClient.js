import { requestJson } from '@/core/api/httpClient'

function normalizeTask(task, fallback = {}) {
  const assignedPerson = task.person ?? task.assignee

  return {
    id: task.id,
    title: task.title ?? task.titel,
    dueDate: task.dueDate ?? task.faelligkeitsdatum,
    status: (task.status ?? 'OFFEN').toLowerCase() === 'erledigt' ? 'done' : 'open',
    personId: task.personId ?? assignedPerson?.id ?? fallback.personId,
    assigneeName:
      task.assigneeName ??
      (assignedPerson ? `${assignedPerson.vorname} ${assignedPerson.name}` : fallback.assigneeName),
  }
}

export function createTaskGatewayClient(apiGatewayUrl) {
  return {
    async listTasks() {
      const tasks = await requestJson(apiGatewayUrl, '/task')
      return tasks.map((task) => normalizeTask(task))
    },

    async createTask(input) {
      const createdTask = await requestJson(apiGatewayUrl, '/task', {
        method: 'POST',
        body: {
          titel: input.title,
          beschreibung: input.description ?? '',
          faelligkeitsdatum: input.dueDate,
          status: 'OFFEN',
          personId: input.personId,
        },
      })

      return normalizeTask(createdTask, input)
    },

    async updateTask(id, input) {
      const updatedTask = await requestJson(apiGatewayUrl, `/task/${id}`, {
        method: 'PATCH',
        body: input,
      })

      return normalizeTask(updatedTask)
    },
  }
}
