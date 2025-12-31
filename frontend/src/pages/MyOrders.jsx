import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserOrders } from '../services/orderServices';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await getUserOrders(token);
                setOrders(response.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-2xl font-bold">Loading orders...</div>
        </div>;
    }

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'text-orange-600 bg-orange-50',
            'Confirmed': 'text-blue-600 bg-blue-50',
            'Shipped': 'text-purple-600 bg-purple-50',
            'Delivered': 'text-green-600 bg-green-50',
            'Cancelled': 'text-red-600 bg-red-50'
        };
        return colors[status] || 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-black text-black mb-2">My Orders</h1>
                    <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-black mb-4">No orders yet</h2>
                        <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide">
                            Browse Products
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order Number</p>
                                        <p className="text-xl font-black text-black">{order.orderNumber}</p>
                                    </div>
                                    <div className="flex gap-4 mt-2 md:mt-0">
                                        <div>
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t-2 border-gray-200 pt-4 mb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded border-2 border-black" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{item.title}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-bold">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {order.items.length > 3 && (
                                        <p className="text-sm text-gray-600 mt-2">+ {order.items.length - 3} more items</p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t-2 border-gray-200 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-black text-black">₹{order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => navigate(`/order-confirmation/${order._id}`)} className="px-6 py-2 border-2 border-black text-black font-bold rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
