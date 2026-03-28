import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Vacancies API
export const vacanciesApi = {
  getAll: () => api.get('/vacancies'),
  getById: (id: string) => api.get(`/vacancies/${id}`),
  create: (data: any) => api.post('/vacancies', data),
  update: (id: string, data: any) => api.put(`/vacancies/${id}`, data),
  delete: (id: string) => api.delete(`/vacancies/${id}`),
};

// Candidates API
export const candidatesApi = {
  getAll: (params?: { vacancyId?: string; status?: string; source?: string }) =>
    api.get('/candidates', { params }),
  getById: (id: string) => api.get(`/candidates/${id}`),
  create: (data: any) => api.post('/candidates', data),
  update: (id: string, data: any) => api.put(`/candidates/${id}`, data),
  delete: (id: string) => api.delete(`/candidates/${id}`),
  score: (id: string) => api.post(`/candidates/${id}/score`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/candidates/${id}/status`, { status }),
};

// Messages API
export const messagesApi = {
  getByCandidate: (candidateId: string) =>
    api.get(`/messages/candidate/${candidateId}`),
  send: (candidateId: string, content: string, channel: 'hh' | 'telegram' | 'whatsapp') =>
    api.post('/messages', { candidateId, content, channel }),
};

// Integrations API
export const integrationsApi = {
  getAll: () => api.get('/integrations'),
  getById: (id: string) => api.get(`/integrations/${id}`),
  create: (data: any) => api.post('/integrations', data),
  update: (id: string, data: any) => api.put(`/integrations/${id}`, data),
  delete: (id: string) => api.delete(`/integrations/${id}`),
  hhConnect: () => api.get('/integrations/hh/connect'),
  hhCallback: (code: string) => api.get('/integrations/hh/callback', { params: { code } }),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getFunnel: () => api.get('/analytics/funnel'),
  getResponseTime: () => api.get('/analytics/response-time'),
  getRejectionReasons: () => api.get('/analytics/rejection-reasons'),
};

// Resumes API
export const resumesApi = {
  getById: (id: string) => api.get(`/resumes/${id}`),
  parse: (data: { text: string }) => api.post('/resumes/parse', data),
};
