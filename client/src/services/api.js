const API_BASE = `${import.meta.env.VITE_API_URL?.replace(/\/+$/, '')}/api`;

export async function apiRequest(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error('Could not connect to the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'The request could not be completed.');
  }
  return data;
}

export const authApi = {
  me: () => apiRequest('/auth/me'),
  register: (details) => apiRequest('/auth/register', { method: 'POST', body: details }),
  login: (details) => apiRequest('/auth/login', { method: 'POST', body: details }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' })
};

export const tasksApi = {
  list: () => apiRequest('/tasks'),
  create: (task) => apiRequest('/tasks', { method: 'POST', body: task }),
  update: (id, task) => apiRequest(`/tasks/${id}`, { method: 'PUT', body: task }),
  toggle: (id) => apiRequest(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  remove: (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' })
};
