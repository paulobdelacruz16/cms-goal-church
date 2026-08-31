const API_BASE_URL = import.meta.env.VITE_API_URL

export async function createFormData(data) {
  const response = await fetch(
    `${API_BASE_URL}/formdata`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to create form data'
    )
  }

  return response.json()
}