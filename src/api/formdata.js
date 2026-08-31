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

export async function getFormData() {
  const response = await fetch(
    `${API_BASE_URL}/formdata`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch form data'
    )
  }

  return response.json()
}

export async function getLatestFormData() {
  const response = await fetch(
    `${API_BASE_URL}/formdata/latest`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch latest form data'
    )
  }

  return response.json()
}


export async function updateFormData(id, data) {
  const response = await fetch(
    `${API_BASE_URL}/formdata/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update form template')
  }

  return response.json()
}