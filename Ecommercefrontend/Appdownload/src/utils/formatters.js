export const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export default api;