const API_BASE_URL = import.meta.env.VITE_API_URL

const AUTH_STORAGE_KEY = 'form-builder-auth'

export async function login(username, password) {
  const response = await fetch(
    `${API_BASE_URL}/loginCredential`
  )

  if (!response.ok) {
    throw new Error('Unable to verify login credentials.')
  }

  const credentials = await response.json()
  const credentialList = Array.isArray(credentials)
    ? credentials
    : [credentials]

  const account = credentialList.find(
    (credential) =>
      credential?.username === username &&
      credential?.password === password
  )

  if (!account) {
    throw new Error('Invalid username or password.')
  }

  const session = {
    username: account.username,
    name: account.name,
    role: account.role,
  }

  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session)
  )

  return session
}

export function getAuthSession() {
  try {
    const session = sessionStorage.getItem(
      AUTH_STORAGE_KEY
    )

    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}