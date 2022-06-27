export async function getJson<T>(url: string): Promise<T> {
  return sendRequest<T>(url, 'GET')
}

export async function postJson(url: string, data?: Record<string, unknown>) {
  return sendRequest(url, 'POST', data)
}

async function sendRequest<T = void>(url: string, method: string, body?: Record<string, unknown>): Promise<T> {
  const authorization = localStorage.getItem('apiKey')

  if (!authorization) {
    throw Error('API key not found in local storage')
  }
  const headers = {
    'content-type': 'application/json',
    authorization,
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  return await response.json()
}
