import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_CHAT_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
