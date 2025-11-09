// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const adminAPI = {
  // Get all users
  getUsers: async (token, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/users?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - getUsers:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Get all booksellers
  getBooksellers: async (token, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/booksellers?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - getBooksellers:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Update user status
  updateUserStatus: async (token, userId, isActive) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - updateUserStatus:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Update bookseller status
  updateBooksellerStatus: async (token, userId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/booksellers/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - updateBooksellerStatus:', error);
      return { success: false, message: 'Network error' };
    }
  }
};