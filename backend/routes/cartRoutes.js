import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.put('/:itemId', protect, updateCartItem);
router.delete('/clear', protect, clearCart);  // Changed from / to /clear to avoid conflict
router.delete('/:itemId', protect, removeFromCart);

export default router;
