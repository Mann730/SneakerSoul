import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderServices';

function Checkout() {
    const navigate = useNavigate();
    const { cart, loading: cartLoading } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Address form state
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const validateAddress = () => {
        const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
        return required.every(field => address[field].trim() !== '');
    };

    const handlePlaceOrder = async () => {
        if (!validateAddress()) {
            alert('Please fill all required address fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                shippingAddress: address,
                paymentMethod
            };

            const response = await createOrder(orderData, token);
            navigate(`/order-confirmation/${response.order._id}`);
        } catch (error) {
            alert(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-2xl font-bold">Loading...</div>
        </div>;
    }

    const cartItems = cart?.items || [];
    const itemsTotal = cart?.totalPrice || 0;
    const shippingCost = itemsTotal > 1000 ? 0 : 50;
    const tax = itemsTotal * 0.18;
    const totalAmount = itemsTotal + shippingCost + tax;

    const steps = [
        { number: 1, title: 'Address', icon: '📍' },
        { number: 2, title: 'Payment', icon: '💳' },
        { number: 3, title: 'Review', icon: '📋' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-black text-black mb-4">Checkout</h1>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className={`flex items-center gap-2 ${currentStep >= step.number ? 'text-black' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${currentStep >= step.number ? 'bg-black text-white border-black' : 'border-gray-300'}`}>
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    <span className="font-bold hidden sm:inline">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-0.5 w-12 sm:w-24 ${currentStep > step.number ? 'bg-black' : 'bg-gray-300'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Address */}
                            {currentStep === 1 && (
                                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-2xl font-black text-black mb-6">📍 Delivery Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-black mb-2">Full Name *</label>
                                            <input type="text" name="fullName" value={address.fullName} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-black mb-2">Phone *</label>
                                            <input type="tel" name="phone" value={address.phone} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-black mb-2">Pincode *</label>
                                            <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-black mb-2">Address Line 1 *</label>
                                            <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-black mb-2">Address Line 2</label>
                                            <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-black mb-2">City *</label>
                                            <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-black mb-2">State *</label>
                                            <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                        </div>
                                    </div>
                                    <button onClick={() => validateAddress() ? setCurrentStep(2) : alert('Please fill all required fields')} className="mt-6 w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide">
                                        Continue to Payment
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-2xl font-black text-black mb-6">💳 Payment Method</h2>
                                    <div className="space-y-3">
                                        {['COD', 'UPI', 'Card', 'NetBanking'].map(method => (
                                            <label key={method} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === method ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5" />
                                                <span className="font-bold">{method === 'COD' ? 'Cash on Delivery' : method}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setCurrentStep(1)} className="flex-1 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide">
                                            Back
                                        </button>
                                        <button onClick={() => setCurrentStep(3)} className="flex-1 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wide">
                                            Review Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <h3 className="text-xl font-black text-black mb-4">📍 Delivery Address</h3>
                                        <p className="font-bold">{address.fullName}</p>
                                        <p>{address.addressLine1}</p>
                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                        <p>{address.city}, {address.state} - {address.pincode}</p>
                                        <p>Phone: {address.phone}</p>
                                        <button onClick={() => setCurrentStep(1)} className="mt-4 text-sm font-bold text-blue-600 hover:underline">
                                            Change Address
                                        </button>
                                    </div>
                                    <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <h3 className="text-xl font-black text-black mb-4">💳 Payment Method</h3>
                                        <p className="font-bold">{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                                        <button onClick={() => setCurrentStep(2)} className="mt-4 text-sm font-bold text-blue-600 hover:underline">
                                            Change Payment
                                        </button>
                                    </div>
                                    <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Placing Order...' : '🎉 Place Order'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8">
                            <h3 className="text-xl font-black text-black mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex gap-3 pb-3 border-b">
                                        <img src={item.product?.image} alt={item.product?.title} className="w-16 h-16 object-cover rounded border-2 border-black" />
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{item.product?.title}</p>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Items Total</span>
                                    <span className="font-bold">₹{itemsTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (18%)</span>
                                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-black pt-2 mt-2">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-black">Total</span>
                                        <span className="font-black">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
