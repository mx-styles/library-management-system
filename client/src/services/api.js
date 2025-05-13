import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },
  
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

// Book services
export const bookService = {
  getAllBooks: async (query = '') => {
    return await api.get(`/books?query=${query}`);
  },
  
  getBook: async (id) => {
    return await api.get(`/books/${id}`);
  },
  
  createBook: async (bookData) => {
    return await api.post('/books', bookData);
  },
};

// Borrow services
export const borrowService = {
  getBorrowedBooks: async () => {
    return await api.get('/borrow');
  },
  
  borrowBook: async (bookId) => {
    return await api.post(`/borrow/borrow/${bookId}`);
  },
  
  returnBook: async (borrowId) => {
    return await api.post(`/borrow/return/${borrowId}`);
  },
};

export default api;
