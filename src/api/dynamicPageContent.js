const API_BASE_URL = import.meta.env.VITE_API_URL

export async function getDynamicPageContents() {
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch dynamic page contents')
  }

  return response.json()
}

export async function getDynamicPageContent(id) {
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch dynamic page content')
  }

  return response.json()
}

export async function createDynamicPageContent(data) {
  console.log('Creating dynamic page content with data:', data);
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create dynamic page content')
  }

  return response.json()
}

export async function getDynamicPageContentById(id) {
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent/${id}`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch dynamic page content'
    )
  }

  return response.json()
}

export async function updateDynamicPageContent(id, data) {
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update dynamic page content')
  }

  return response.json()
}

export async function deleteDynamicPageContent(id) {
  const response = await fetch(
    `${API_BASE_URL}/dynamicPageContent/${id}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete dynamic page content')
  }

  return response.json()
}