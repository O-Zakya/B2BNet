const API_URL = 'http://localhost:5000';

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: getBaseHeaders(),
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      throw new Error(errBody?.error || 'Authentication failed');
    }

    const data = await response.json();

    // Save token and user locally so other parts of the app can use them
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export function getAuthHeader(): { Authorization?: string } {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getBaseHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
}

export async function signOut() {
  try {
    // Optionally call backend signout if you have one (e.g. to clear cookies/session)
    // await fetch(`${API_URL}/signout`, { method: 'POST', credentials: 'include' });
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
