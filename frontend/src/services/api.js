const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';
const BASE_URL = `${API_BASE}/api`;


class ApiService {
  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('liferpg_token') : null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('liferpg_token', token);
      } else {
        localStorage.removeItem('liferpg_token');
      }
    }
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.error || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth
  async register(email, username, password, avatar_class = 'cyber_knight') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, avatar_class }),
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(emailOrUsername, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // Tasks / Quests
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
    if (params.sort) query.append('sort', params.sort);
    
    const qs = query.toString();
    return this.request(`/tasks${qs ? `?${qs}` : ''}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async completeTask(id) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'POST',
    });
  }

  // Character
  async getCharacter() {
    return this.request('/character');
  }

  async updateClass(avatar_class) {
    return this.request('/character/class', {
      method: 'PUT',
      body: JSON.stringify({ avatar_class }),
    });
  }

  async equipItem(item_key, unequip = false) {
    return this.request('/character/equip', {
      method: 'PUT',
      body: JSON.stringify({ item_key, unequip }),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.request('/character/avatar', {
      method: 'POST',
      body: formData,
    });
  }

  async removeAvatar() {
    return this.request('/character/avatar', {
      method: 'DELETE',
    });
  }

  // Shop & Inventory
  async getShopItems() {
    return this.request('/shop/items');
  }

  async buyItem(item_key) {
    return this.request('/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ item_key }),
    });
  }

  async getInventory() {
    return this.request('/inventory');
  }

  // Stats
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }

  async getHistory() {
    return this.request('/stats/history');
  }
}

export const api = new ApiService();
