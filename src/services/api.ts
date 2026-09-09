import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lumora-clothing-production.up.railway.app/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('lumora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;