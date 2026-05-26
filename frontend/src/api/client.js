import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export const authApi = {
  async register(payload) {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  async login(payload) {
    const response = await api.post('/auth/login', payload);
    return response.data;
  }
};

export const taskApi = {
  async list() {
    const response = await api.get('/tasks');
    return response.data;
  },
  async create(payload) {
    const response = await api.post('/tasks', payload);
    return response.data;
  },
  async update(id, payload) {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data;
  },
  async toggle(id) {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
  async remove(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api;
