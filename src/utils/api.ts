const API_BASE_URL = 'https://skillswap-ipcj.onrender.com';

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('skillswap_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function getRealUsers() {
  return apiRequest('/users/');
}

export { API_BASE_URL };