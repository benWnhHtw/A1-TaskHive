export const appConfig = {
  apiGatewayUrl: import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080',
  useMocks: import.meta.env.VITE_USE_MOCKS !== 'false',
}
