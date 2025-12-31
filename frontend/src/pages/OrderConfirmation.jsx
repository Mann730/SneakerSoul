import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOrderById } from '../services/orderServices';

function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await getOrderById(orderId, token);
                setOrder(response.order);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-2xl font-bold">Loading...</div>
        </div>;
    }

    if (!order) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-black mb-4">Order not found</h2>
                <button onClick={() => navigate('/products')} className="px-6 py-2 bg-black text-white font-bold rounded-lg">
                    Continue Shopping
                </button>
            </div>
        </div>;
    }

    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-4xl font-black text-black mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-600">Thank you for shopping with SneakerSoul</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Order Number</p>
                            <p className="text-xl font-black text-black">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                            <p className="text-xl font-black text-green-600">{estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <h2 className="text-xl font-black text-black mb-4">📦 Order Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded border-2 border-black" />
                                <div className="flex-1">
                                    <p className="font-bold text-black">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.brand}</p>
                                    <p className="text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-black">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <h2 className="text-xl font-black text-black mb-4">📍 Delivery Address</h2>
                    <p className="font-bold">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <h2 className="text-xl font-black text-black mb-4">💰 Payment Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Items Total</span>
                            <span className="font-bold">₹{order.itemsTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-bold text-green-600">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span className="font-bold">₹{order.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t-2 border-black pt-2 mt-2">
                            <div className="flex justify-between text-xl">
                                <span className="font-black">Total Paid</span>
                                <span className="font-black">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm"><span className="font-bold">Payment Method:</span> {order.paymentMethod}</p>
                            <p className="text-sm"><span className="font-bold">Payment Status:</span> <span className="text-orange-600">{order.paymentStatus}</span></p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex gap-4">
                    <button onClick={() => navigate('/my-orders')} className="flex-1 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
                        View All Orders
                    </button>
                    <button onClick={() => navigate('/products')} className="flex-1 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
