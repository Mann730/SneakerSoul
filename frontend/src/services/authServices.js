import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:7000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  try {
    const response = await API.post('/register', {
      name: data.name || data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await API.post('/verify-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await API.post('/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};