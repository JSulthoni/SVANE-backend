// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import stripe from 'stripe'

export const STRIPE_PAYMENT = async (req, res) => {
    stripe.charges.create({
        source : req.body.tokenId,
        amount : req.body.amount,
        currency: 'USD',
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json(stripeErr)
        } else {
            res.status(200).json(stripeRes)
        }
    })
}