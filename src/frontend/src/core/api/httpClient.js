export class HttpError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new HttpError(`API request failed: ${response.status}`, response.status)
  }

  if (response.status === 204) {
    return undefined
  }

  const responseBody = await response.text()

  if (!responseBody) {
    return undefined
  }

  return JSON.parse(responseBody)
}
