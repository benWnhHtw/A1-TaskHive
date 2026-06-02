import { createTaskGatewayClient } from '@/features/tasks/api/taskGatewayClient'
import { createMockTaskGateway } from '@/mocks/taskGatewayMock'
import { appConfig } from '@/core/config/env'

export function createApiGateway() {
  return {
    tasks: appConfig.useMocks
      ? createMockTaskGateway()
      : createTaskGatewayClient(appConfig.apiGatewayUrl),
  }
}

export const apiGateway = createApiGateway()
