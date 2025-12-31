import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate totals
        const itemsTotal = cart.totalPrice;
        const shippingCost = itemsTotal > 1000 ? 0 : 50; // Free shipping above ₹1000
        const tax = itemsTotal * 0.18; // 18% GST
        const totalAmount = itemsTotal + shippingCost + tax;

        // Create order items from cart
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            title: item.product.title,
            brand: item.product.brand,
            image: item.product.image,
            quantity: item.quantity,
            price: item.price
        }));

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            itemsTotal,
            shippingCost,
            tax,
            totalAmount,
            orderStatus: 'Pending',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending'
        });

        // Clear cart after order
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders for user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('items.product');

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('items.product');

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

