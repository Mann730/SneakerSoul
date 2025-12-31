import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../services/cartServices';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch cart when component mounts or user logs in
    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCart(null);
            setCartCount(0);
            return;
        }

        try {
            setLoading(true);
            const response = await getCart(token);
            setCart(response.cart);
            setCartCount(response.cart?.items?.length || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Don't throw error, just set empty cart
            setCart(null);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to add items to cart');
        }

        try {
            const response = await addToCartAPI(productId, quantity, token);
            setCart(response.cart);
            setCartCount(response.cart?.items?.length || 0);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Update cart item quantity
    const updateQuantity = async (itemId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await updateCartItem(itemId, quantity, token);
            setCart(response.cart);
            setCartCount(response.cart?.items?.length || 0);
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    };

    // Remove item from cart
    const removeItem = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await removeFromCartAPI(itemId, token);
            setCart(response.cart);
            setCartCount(response.cart?.items?.length || 0);
        } catch (error) {
            console.error('Error removing item:', error);
            throw error;
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await clearCartAPI(token);
            setCart(response.cart);
            setCartCount(0);
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const value = {
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
