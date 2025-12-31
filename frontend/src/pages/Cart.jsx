import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

function Cart() {
    const navigate = useNavigate();
    const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error) {
            alert('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        setRemoving(itemId);
        try {
            await removeItem(itemId);
        } catch (error) {
            alert('Failed to remove item');
        } finally {
            setRemoving(null);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            try {
                await clearCart();
            } catch (error) {
                alert('Failed to clear cart');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-2xl font-bold text-black">Loading cart...</div>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const totalPrice = cart?.totalPrice || 0;

    return (
        <div className="min-h-screen bg-white py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 text-sm font-bold text-black hover:text-gray-600 transition-colors uppercase tracking-wide"
                    >
                        <span>←</span> Continue Shopping
                    </button>
                    <h1 className="text-4xl lg:text-5xl font-black text-black mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </motion.div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-black mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Add some sneakers to get started!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide"
                        >
                            Browse Products
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.title}
                                                className="w-24 h-24 object-cover rounded-lg border-2 border-black"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-black mb-1">
                                                    {item.product?.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {item.product?.brand} • {item.product?.genre}
                                                </p>
                                                <p className="text-lg font-bold text-black">
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    disabled={removing === item._id}
                                                    className="text-red-600 hover:text-red-800 font-bold text-sm"
                                                >
                                                    {removing === item._id ? 'Removing...' : '✕ Remove'}
                                                </button>
                                                <div className="flex items-center gap-2 border-2 border-black rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                        className="px-3 py-1 font-bold hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        className="px-3 py-1 font-bold hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-gray-600 mt-2">
                                                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {cartItems.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="w-full py-2 text-red-600 hover:text-red-800 font-bold text-sm border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8"
                            >
                                <h2 className="text-2xl font-black text-black mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-semibold">Calculated at checkout</span>
                                    </div>
                                    <div className="border-t-2 border-black pt-3 mt-3">
                                        <div className="flex justify-between text-black">
                                            <span className="text-xl font-bold">Total</span>
                                            <span className="text-2xl font-black">₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-4 bg-black text-white font-bold text-lg rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all uppercase tracking-wide"
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Secure checkout powered by SneakerSoul
                                </p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
