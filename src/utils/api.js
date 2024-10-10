import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-backend-3jm8.onrender.com',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ensure this matches where you store the token// Add this line
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }// Add this line
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
