const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')).token 
    : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the API request');
  }

  return data;
};