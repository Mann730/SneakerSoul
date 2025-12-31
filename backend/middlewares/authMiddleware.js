import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        console.log('Token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('User found:', req.user ? req.user.email : 'No user');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, admin only' });
    }
}