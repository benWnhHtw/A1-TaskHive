import { requestJson } from '@/core/api/httpClient'

export function createTaskGatewayClient(apiGatewayUrl) {
  return {
    listTasks() {
      return requestJson(apiGatewayUrl, '/tasks')
    },

    createTask(input) {
      return requestJson(apiGatewayUrl, '/task', {
        method: 'POST',
        body: input,
      })
    },

    updateTask(id, input) {
      return requestJson(apiGatewayUrl, `/tasks/${id}`, {
        method: 'PATCH',
        body: input,
      })
    },
  }
}
