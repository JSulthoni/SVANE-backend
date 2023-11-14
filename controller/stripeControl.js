import productModel from '../models/productModel.js';
import stripeModel from '../models/stripeModel.js';
import Stripe from 'stripe';


// create a session
// POST
export const STRIPE_CHECKOUT = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16'
    })
    const DOMAIN = process.env.CLIENT_URL
    const { products } = req.body
    console.log(products)
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
        // Creating stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: line_item,
            mode: 'payment',
            success_url: `${DOMAIN}/success`,
            cancel_url: `${DOMAIN}/`,
            payment_method_types: ['card']
          });

          // Posting order to database
          await stripeModel.create({
            products: [...products],
            stripeid: session.id
          });

        res.send(JSON.stringify({ url: session.url }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    };
};