export async function apiGet(path) {
  const res = await fetch(`/api${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

export async function apiSend(path, method, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const CATEGORY_COLORS = {
  Government: '#38bdf8',
  Healthcare: '#34d399',
  'E-commerce': '#fb7185',
  'Mobile App': '#a78bfa',
  'Mobile Apps': '#a78bfa',
}

export function catColor(cat) {
  return CATEGORY_COLORS[cat] || '#38bdf8'
}
