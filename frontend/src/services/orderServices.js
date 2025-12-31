import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:7000/api/orders',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create order
export const createOrder = async (orderData, token) => {
    try {
        const response = await API.post('/', orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user's orders
export const getUserOrders = async (token) => {
    try {
        const response = await API.get('/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
    try {
        const response = await API.get(`/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
