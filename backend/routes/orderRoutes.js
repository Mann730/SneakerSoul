import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User routes (require authentication)
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:orderId/status', protect, adminOnly, updateOrderStatus);

export default router;
