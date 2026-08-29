const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    credentials: 'include',

    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = 'Something went wrong'

    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message)
  }

  return response.json()
}