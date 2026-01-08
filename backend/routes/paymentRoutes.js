import express from 'express';
import {
    createPaymentIntent,
    confirmPayment,
    getOrder,
    getUserOrders,
    createCheckoutSession,
    verifySession,
    getSessionStatus,
} from '../controllers/paymentController.js';
import { isAuthincated } from '../middleware/isAuthinticated.js';

const router = express.Router();

// Payment routes
router.post('/create-intent', isAuthincated, createPaymentIntent);
router.post('/confirm-payment', isAuthincated, confirmPayment);
router.post('/checkout-session', isAuthincated, createCheckoutSession);
router.get('/verify-session/:sessionId', isAuthincated, verifySession);
router.get('/session-status', getSessionStatus);

// Order routes
router.get('/order/:orderId', isAuthincated, getOrder);
router.get('/my-orders', isAuthincated, getUserOrders);

export default router;
