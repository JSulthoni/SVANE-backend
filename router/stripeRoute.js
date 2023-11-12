import express from 'express'
import { STRIPE_PAYMENT } from '../controller/stripeControl.js';
const router = express.Router()

// Endpoint for stripe payment
router.post('/', STRIPE_PAYMENT)

export default router;