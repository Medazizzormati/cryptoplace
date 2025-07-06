import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
});

export const signup = (userData) => API.post('/signup', userData);
export const signin = (authData) => API.post('/signin', authData);
