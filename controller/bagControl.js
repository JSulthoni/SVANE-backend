import bagModel from '../models/BagModel.js';
import userModel from '../models/userModel.js';
import createError from '../utils/createError.js';
import { VERIFY_TOKEN } from '../utils/verifySecrets.js';

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

// get user bag
// GET
export const GET_BAG = async (req, res, next) => {
    // console.log('GET_BAG INITIALIZED')
    // console.log('Headers: ', req.headers);
    try {
        await VERIFY_TOKEN(req, res, async () => {
            const { id } = req.user;
            // console.log('GET BAG REQUESTED FOR ID: ', id);
            // Use findOne directly with the user email
            const getBag = await bagModel.findOne({ userId: id })
                .populate('cart.product')
                .populate('wishlist.product');

            // If the bag is not found
            if (!getBag) return next(createError(404, `Cannot get bag for user with ID of ${id}`));

            res.status(200).json(getBag);
        });
    } catch (error) {
        next(error);
    }
};


// create a single bag
// POST
export const CREATE_BAG = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user_id = await userModel.findOne({ email });

        // Initializing user's bag as empty cart and wishlist array
        const createdBag = await bagModel.create({
            userId: user_id._id,
            cart: [],
            wishlist: []
        });

        // If post request is failed 
        if (!createdBag) return next(createError(500, `Failed create bag for user with ID of ${id}`));

        const { userId, cart, wishlist } =  createdBag;
        res.status(201).json({cart, wishlist});
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
        
        /*
        req.body = {
            cart : [{ productId: productId-1, quantity: quantity }, { productId: productId-2, quantity: quantity }, { productId: productId-3, quantity: quantity }],
            wishlist : [{ productId: productId-1 }, { productId: productId-2 }, { productId: productId-3 }, { productId: productId-4 }]
        }
        */
        const { id } = req.user;
        const { cart, wishlist } = req.body;
        // Find the bag by user email
        const bag = await bagModel.findOne({ userId: id });

            // Check if the bag exists
            if (!bag) {
                return next(createError(500, `Found error in accessing bag for user ${email}`));
            }

            // Updates the array of user bag's cart and wishlist
            
            if (cart) {
                bag.cart.push(cart.map((car) => car));
            }
            if (wishlist) {
                bag.wishlist.push(wishlist.map((wish) => wish));
            }

        // Save the updated bag
        const updatedBag = await bag.save();

        res.status(200).json(updatedBag);
        })
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
