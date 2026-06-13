import { createPersonGatewayClient } from '@/features/persons/api/personGatewayClient'
import { createTaskGatewayClient } from '@/features/tasks/api/taskGatewayClient'
import { createMockPersonGateway } from '@/mocks/personGatewayMock'
import { createMockTaskGateway } from '@/mocks/taskGatewayMock'
import { appConfig } from '@/core/config/env'

export function createApiGateway() {
  return {
    persons: appConfig.useMocks
      ? createMockPersonGateway()
      : createPersonGatewayClient(appConfig.apiGatewayUrl),
    tasks: appConfig.useMocks
      ? createMockTaskGateway()
      : createTaskGatewayClient(appConfig.apiGatewayUrl),
  }
}

export const apiGateway = createApiGateway()
