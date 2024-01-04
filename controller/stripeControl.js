import productModel from '../models/productModel.js';
import stripeModel from '../models/stripeModel.js';
import bagModel from '../models/bagModel.js';
import Stripe from 'stripe';
import createError from '../utils/createError.js';
import { VERIFY_TOKEN } from '../utils/verifySecrets.js';


// create a session
// POST
export const STRIPE_CHECKOUT = async (req, res, next) => {

    const DOMAIN = process.env.CLIENT_URL
    try {
        await VERIFY_TOKEN(req, res, async () => {
            // id is the user's _id from credentials included in cookie
            const { id } = await req.user || { id: undefined };
            // If user token expires, user will not have id present in verify token
            // thus will not return new access token 
            if (!id) return next(createError(403, 'You are not authorized!'));

            // In this function, the array of object of products is referenced as { cart }
            // Options wether the checkout is made from cart or wishlist or direct from product page
            const { payload, option } = await req.body

            // Initializing stripe session if there are request from frontend
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                apiVersion: '2023-10-16'
            })

            // This expression is to fetch the price from backend by looking the id of ordered
            // produnct from the frontend
            const line_item = await Promise.all(
                payload.map( async (item) => {
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
                userId: id,
                stripeId: session.id,
                products: [ ...payload ]
            });

            // Remove purchased items from user's cart after a successful checkout
            if (option === 'cart') {
                // Run the logic for the cart option
                await bagModel.findOneAndUpdate(
                    { userId: id },
                    { $pull: { cart: { 'product': { $in: payload.map((item) => item.product._id) } } } },
                    { new: true }
                );
            } else if (option === 'wishlist') {
                // Run the logic for the wishlist option
                await bagModel.findOneAndUpdate(
                    { userId: id },
                    { $pull: { wishlist: { 'product': { $in: payload.map((item) => item.product._id) } } } },
                    { new: true }
                );
            }

            res.send(JSON.stringify({ url: session.url }));
        });
    } catch (error) {
        console.error('Error in creating checkout session', error);
        next(error);
    };
};