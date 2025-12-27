import express from 'express';
import sendOtpMail from '../middlewares/sendOtpMail.js';
import { register, verifyOtp, deleteUser, login } from '../controllers/user.js';

const router = express.Router();

router.post('/register', register, sendOtpMail, (req, res) => {
    console.log('✅ Registration flow completed successfully');
    res.status(200).json({ message: 'Registration successful, OTP sent to email' });
});

router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// DELETE route for testing - remove in production
router.delete('/delete-user', deleteUser);

// Error handling middleware (must be last)
router.use((err, req, res, next) => {
    console.error('❌ Route error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default router;