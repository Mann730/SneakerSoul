import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:7000/api/cart',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add product to cart
export const addToCart = async (productId, quantity, token) => {
    try {
        const response = await API.post('/add',
            { productId, quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user's cart
export const getCart = async (token) => {
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

// Update cart item quantity
export const updateCartItem = async (itemId, quantity, token) => {
    try {
        const response = await API.put(`/${itemId}`,
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Remove item from cart
export const removeFromCart = async (itemId, token) => {
    try {
        const response = await API.delete(`/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Clear entire cart
export const clearCart = async (token) => {
    try {
        const response = await API.delete('/clear', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
