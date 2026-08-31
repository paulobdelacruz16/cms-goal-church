const API_BASE_URL = import.meta.env.VITE_API_URL

export async function getFormTemplate(id) {
  const response = await fetch(
    `${API_BASE_URL}/formtemplate`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch form template')
  }

  return response.json()
}

export async function createFormTemplate(data) {
  console.log('Creating form template with data:', data);
  const response = await fetch(
    `${API_BASE_URL}/formtemplate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create form template')
  }

  return response.json()
}

export async function getFormTemplateById(id) {
  const response = await fetch(
    `${API_BASE_URL}/formtemplate/${id}`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch form template'
    )
  }

  return response.json()
}

export async function updateFormTemplate(id, data) {
  const response = await fetch(
    `${API_BASE_URL}/formtemplate/${id}`,
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

export async function deleteFormTemplate(id) {
  const response = await fetch(
    `${API_BASE_URL}/formtemplate/${id}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete form template')
  }

  return response.json()
}