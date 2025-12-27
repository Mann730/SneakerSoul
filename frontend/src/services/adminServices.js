import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:7000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Admin login
export const adminLogin = async (data) => {
    try {
        const response = await API.post('/auth/login', {
            email: data.email,
            password: data.password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create product (admin only)
export const createProduct = async (data, token) => {
    try {
        const response = await API.post('/admin/products/create-product', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update product (admin only)
export const updateProduct = async (id, data, token) => {
    try {
        const response = await API.put(`/products/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete product (admin only)
export const deleteProduct = async (id, token) => {
    try {
        const response = await API.delete(`/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await API.get('/products');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
