const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // Notes API methods
  async getNotes() {
    return this.request('/notes');
  }

  async getNote(id) {
    return this.request(`/notes/${id}`);
  }

  async createNote(noteData) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/notes/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/delete/${id}`, {
      method: 'DELETE',
    });
  }

  async searchNotes(searchTerm) {
    return this.request(`/notes/search?q=${encodeURIComponent(searchTerm)}`);
  }

  async bulkDeleteNotes(noteIds) {
    return this.request('/notes/bulkDelete', {
      method: 'DELETE',
      body: JSON.stringify({ noteIds }),
    });
  }
}

export default new ApiService();
