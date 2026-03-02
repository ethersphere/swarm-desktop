export async function getJson<T>(url: string): Promise<T> {
  return sendRequest<T>(url, 'GET')
}

export async function postJson(url: string, data?: Record<string, unknown>) {
  return sendRequest(url, 'POST', data)
}

type RequestResponseTypes = 'json' | 'string'

export function getHost() {
  return import.meta.env.VITE_BEE_DESKTOP_URL || `${window.location.protocol}//${window.location.host}`
}

export async function sendRequest<T = void>(
  url: string,
  method: string,
  body?: Record<string, unknown>,
  type: RequestResponseTypes = 'json',
): Promise<T> {
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

  if (type === 'string') {
    return (await response.text()) as unknown as T
  }

  return await response.json()
}
