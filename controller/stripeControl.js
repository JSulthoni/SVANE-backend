import productModel from '../models/productModel.js';
import stripeModel from '../models/stripeModel.js';
import Stripe from 'stripe';


// create a session
// POST
export const STRIPE_CHECKOUT = async (req, res, next) => {
    const DOMAIN = process.env.CLIENT_URL
    const { products } = req.body

    // Initializing stripe session if there are request from frontend
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16'
    })

    // This expression is to fetch the price from backend by looking the id of ordered
    // produnct from the frontend
    const line_item = await Promise.all(
        products.map( async (product) => {
            const item = await productModel.findById(product.id)
            console.log(item)
            return {
                price_data: {
                    currency:"usd",
                    unit_amount: parseInt(item.price * 100),
                    product_data: {
                        name: item.title
                    }
                },
                quantity: parseInt(product.quantity)
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

          // If there is session, then the order info will also stored into the database
          await stripeModel.create({
            products: [...products],
            stripeid: session.id
          });

        res.send(JSON.stringify({ url: session.url }));
    } catch (error) {
        next(error);
    };
};