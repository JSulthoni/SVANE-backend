import productModel from '../models/productModel.js';
import stripeModel from '../models/stripeModel.js';
import Stripe from 'stripe';
import createError from '../utils/createError.js';


// create a session
// POST
export const STRIPE_CHECKOUT = async (req, res, next) => {
    const DOMAIN = process.env.CLIENT_URL

    // In this function, the array of object of products is referenced as { cart }
    const { cart } = req.body

    // Initializing stripe session if there are request from frontend
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16'
    })

    // This expression is to fetch the price from backend by looking the id of ordered
    // produnct from the frontend
    const line_item = await Promise.all(
        cart.map( async (item) => {
            const product = await productModel.findById(item.product._id);
            if (!product) {
                return next(createError(404, `Product not found for ${item.product._id}`));
            }
            return {
                price_data: {
                    currency:"usd",
                    unit_amount: parseInt(product.price * 100),
                    product_data: {
                        name: product.title
                    }
                },
                quantity: parseInt(item.quantity)
            }
        })
    );

    try {
        // This expression pass the request to stripe with mode of 'payment'
        const session = await stripe.checkout.sessions.create({
            line_items: line_item,
            mode: 'payment',
            success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/`,
            payment_method_types: ['card']
          });

        if (!session) return next(createError(500, 'Stripe server error while processing order'));

        // If there is session, then the order info will also stored into the database
        await stripeModel.create({
            products: [...cart],
            stripeid: session.id
        });

        res.send(JSON.stringify({ url: session.url }));
    } catch (error) {
        console.error('Error in creating checkout session', error);
        next(error);
    };
};