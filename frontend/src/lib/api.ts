type ApiError = {
  error?: string;
  message?: string;
  statusCode?: number;
};

// Base URL de votre backend.
// La variable est fournie via `frontend/.env` (ex: VITE_API_BASE_URL).
// NB: Ici le code utilise VITE_API_URL, donc on fallback sur VITE_API_BASE_URL si besoin.
const API_URL =
  // (Optionnel) si vous définissez VITE_API_URL dans le .env
  import.meta.env.VITE_API_URL ||
  // (Recommandé) si vous définissez VITE_API_BASE_URL dans le .env
  import.meta.env.VITE_API_BASE_URL ||
  // fallback local
  'http://localhost:5000';

console.log('API_URL:', API_URL); 

// Wrapper générique autour de fetch pour centraliser :
// - sérialisation JSON
// - ajout du header Authorization si token
// - parsing réponse + erreurs normalisées
async function request<T>(
  path: string,
  options: {
    method?: string;
    token?: string | null;
    body?: unknown;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = 'GET', token, body, signal } = options;


  // Headers communs à toutes les routes de l'API.
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Si token fourni => authentification JWT.
  if (token) headers.Authorization = `Bearer ${token}`;


  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal
  });

  // On lit la réponse en texte d'abord pour gérer proprement les réponses vides.
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  // En cas d'erreur HTTP, on tente de remonter un message plus précis.
  if (!res.ok) {
    const err: ApiError = (json || {}) as ApiError;
    throw new Error(err.error || err.message || `Request failed (${res.status})`);
  }

  // Contrat: retourne JSON (ou {} si réponse vide).
  return (json ?? ({} as T)) as T;

}

export const api = {
  auth: {
    login: (payload: { email: string; password: string }) =>
      request<{ token: string; user: { email?: string; username?: string } }>(
        '/api/auth/login',
        { method: 'POST', body: payload }
      ),
    register: (payload: { username: string; email: string; password: string }) =>
      request<{ token: string; user: { email?: string; username?: string } }>(
       '/api/auth/signup',
        { method: 'POST', body: payload }
      )
  },
  tasks: {
    list: (token: string) => request<{ tasks: unknown[] }>(`/api/tasks`, { token }),
    create: (
      token: string,
      payload: { title: string; description?: string }
    ) => request<{ task: unknown }>(`/api/tasks`, { method: 'POST', token, body: payload }),
    update: (
      token: string,
      id: string,
      payload: { title?: string; description?: string; completed?: boolean }
    ) => request<{ task: Record<string, unknown> }>(`/api/tasks/${id}`, { method: 'PUT', token, body: payload }),

    remove: (token: string, id: string) => request<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE', token })
  }
};

