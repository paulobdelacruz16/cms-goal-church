import { apiFetch } from './client'

export function getHome() {
  return apiFetch('/api/home')
}

export function createHome(data) {
  return apiFetch('/api/home', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}