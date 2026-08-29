import { apiFetch } from './client'

const ENDPOINT = '/api/dynamicPageContent'

export function getDynamicPageContent() {
  return apiFetch(ENDPOINT)
}

export function getDynamicPageContentById(id) {
  return apiFetch(`${ENDPOINT}/${id}`)
}

export function createDynamicPageContent(data) {
  return apiFetch(ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateDynamicPageContent(id, data) {
  return apiFetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteDynamicPageContent(id) {
  return apiFetch(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
  })
}