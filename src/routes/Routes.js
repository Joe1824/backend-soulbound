import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser } from '../controllers/registerController.js';
import { authenticateUser } from '../controllers/authenticationController.js';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 registration attempts per hour
    message: 'Too many registration attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', registerLimiter, registerUser);
router.post('/verify', authLimiter, authenticateUser);

export default router;
