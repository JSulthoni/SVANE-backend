import express from 'express';
const router = express.Router();
import { STRIPE_CHECKOUT } from '../controller/stripeControl.js';

// Endpoint for stripe payment
router.post('/create/', STRIPE_CHECKOUT);

export default router;