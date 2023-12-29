import bagModel from '../models/bagModel.js';
import userModel from '../models/userModel.js';
import createError from '../utils/createError.js';
import { VERIFY_TOKEN } from '../utils/verifySecrets.js';


// get user bag
// GET
export const GET_BAG = async (req, res, next) => {
    try {
        await VERIFY_TOKEN(req, res, async () => {
            // id is the user's _id from credentials included in cookie
            const { id } = req.user;

            const getBag = await bagModel.findOne({ userId: id })
                .populate({
                    path: 'cart.product',
                    select: '_id title description image1 price'
                })
                .populate({
                    path: 'wishlist.product',
                    select: '_id title description image1 price'
                });

            if (!getBag) return next(createError(404, `Cannot get bag for user with ID of ${id}`));
            
            res.status(200).json({
                cart: getBag.cart,
                wishlist: getBag.wishlist
            });
        });
    } catch (error) {
        next(error);
    }
};



// create a single bag DELETE SOON
// POST
export const CREATE_BAG = async (req, res, next) => {
    try {
        await VERIFY_TOKEN(req, res, async () => {
            // id is the user's _id from credentials included in cookie
            const { id } = req.user;
            const user = await userModel.findOne({ _id: id });

            // Initializing user's bag as empty cart and wishlist array
            const createdBag = await bagModel.create({
                userId: user._id,
                cart: [],
                wishlist: []
            });

            // If post request is failed 
            if (!createdBag) return next(createError(500, `Failed create bag for user with ID of ${id}`));
            
            res.status(200).json({
                cart: createdBag.cart,
                wishlist: createdBag.wishlist
            });
        })
    } catch (error) {
        console.log('error while creating bag: ', error);
        next(error);
    }
};

// Update user's bag
// PUT
export const UPDATE_BAG = async (req, res, next) => {
    try {
        await VERIFY_TOKEN(req, res, async () => {
            // id is the user's _id from credentials included in cookie
            const { id } = req.user;
            const { cart, wishlist } = req.body;

            // Using findOneAndUpdate() to update user's bag
            const updatedBag = await bagModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        cart: cart.length > 0 ? cart.map((item) => ({
                            product: item._id,
                            quantity: parseInt(item.quantity)
                        })) : [],
                        wishlist: wishlist.length > 0 ? wishlist.map((item) => ({ 
                            product: item._id 
                        })) : []
                    }
                }
            );
            
            // Create error of gab is not found
            if (!updatedBag) return next(createError(404, `Cannot get bag for user with ID of ${id}`));
            
            res.status(200).json('Bag Updated');
        });
    } catch (error) {
        next(error);
    }
};


// ========Below this line is code not available to client UI===========

// get all bag
// GET
export const GET_ALL_BAG = async (req, res, next) => {
    try {
        const allBags = await bagModel.find({})
            .populate('userId')
            .populate('cart.product')
            .populate('wishlist.product');

        // If no bags are found
        if (allBags.length === 0) {
            return next(createError(404, 'No bags found'));
        }

        res.status(200).json(allBags);
    } catch (error) {
        next(error);
    }
};


// Delete user's bag
// DELETE
export const DELETE_BAG = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Find the bag by ID
        const deletedBag = await bagModel.findOneAndDelete({ email });
        
        // Check if the bag exists
        if (!deletedBag) {
            return next(createError(404, `Bag not found for user ${email}`));
        }

        res.status(200).json(deletedBag);
    } catch (error) {
        next(error);
    }
};
