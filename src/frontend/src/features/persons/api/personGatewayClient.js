import { requestJson } from '@/core/api/httpClient'

export function createPersonGatewayClient(apiGatewayUrl) {
  return {
    listPersons() {
      return requestJson(apiGatewayUrl, '/person')
    },
  }
}
