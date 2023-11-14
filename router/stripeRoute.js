import express from 'express'
import { STRIPE_CHECKOUT } from '../controller/stripeControl.js';
const router = express.Router()

// Endpoint for stripe payment
router.post('/create/', STRIPE_CHECKOUT)

export default router;