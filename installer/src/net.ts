export async function getJson(url: string) {
  return sendRequest(url, 'GET')
}

export async function postJson(url: string, data?: Record<string, unknown>) {
  return sendRequest(url, 'POST', data)
}

async function sendRequest(url: string, method: string, body?: Record<string, unknown>): Promise<Record<string, any>> {
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
