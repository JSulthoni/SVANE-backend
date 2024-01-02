import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import bagModel from '../models/bagModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from "../utils/createError.js";
import { VERIFY_TOKEN } from '../utils/verifySecrets.js';


// This function it to sign user credentials
const SIGN_TOKEN = (user) => {
    const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, isSeller: user.isSeller },
        process.env.JWT_SECRET_KEY_DO_NOT_PUBLISH, 
        {
            expiresIn: '6h'
        }
    );
    return token;
}

// This is the cookie option for setting cookies
const cookie_option = {
    httpOnly: true,
    maxAge: 6 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
}


// Create a new user and issue access_token upon successful account creation
// POST
export const CREATE_USER = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Checking if the body has all the required parameters
        const { email, password, wishlist } = await req.body;

        // Creating new user
        // Using bcryptjs to hash password, email and password are provided from client
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const createdUser = await userModel.create(
            [{ email: email, password: hash }],
            { session: session }
        );

        // Initializing user's bag
        const createdBag = await bagModel.create(
            [
                {
                    userId: createdUser[0]._id,
                    cart: [],

                    // User may have wishlist before creating an account. when user create an account, the data in wishlist will be taken into bag creation
                    wishlist: wishlist.length > 0 ? wishlist.map((item) => ({ product: item._id })) : []
                },
            ],
            { session: session }
        );

        await session.commitTransaction();
        session.endSession();

        // If server fails to create user bag or user account
        if (!createdUser || !createdBag) {
            return next(createError(500, `Failed to create user and bag for user ${email}.`));
        }

        // Create a token for the newly created user
        const token = SIGN_TOKEN(createdUser[0]);

        // Filtering data before sending it back to client
        const { email: userEmail, ...otherDetails } = createdUser[0]._doc;

        res.cookie('access_token', token, cookie_option).status(201).json(userEmail);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

 
// Sign In single user
// POST
export const SIGNIN_USER = async (req, res, next) => {
    try {
        const body = await req.body;

        // Finding user in database based on email on body
        const isUser =  await userModel.findOne({ email: body.email });
        if (!isUser) return next(createError(404, 'Credentials not found'));
        
        // Comparing password from db and body by using bcryptjs
        // Remember that password stored in db is hashed
        const isPassword = await bcrypt.compare(body.password, isUser.password);
        if (!isPassword) return next(createError(400, 'Invalid credentials'));

        // Create a token that will be send to user if request is successful
        const token = SIGN_TOKEN(isUser);

        // Destructuring to filter out sensitive information before sending it to client
        const { email, ...otherDetails } = isUser._doc;
        
        // Set the token as a cookie and send it in the response
        res.cookie('access_token', token, cookie_option).status(201).json(email);
    } catch (error) {
        next(error);
    }
};


// Refresh user
// GET
export const REFRESH_USER = async (req, res, next) => {
    try {
        await VERIFY_TOKEN(req, res, async () => {
            const { id } = await req.user || { id: undefined };
            // If user cookie expires, user will not have id present in verify token
            // thus will not return new access token 
            if (!id) return;

            const isUser =  await userModel.findOne({ _id: id });
            if (!isUser) return;

            // Create a token that will be send to user if request is successful
            const token = SIGN_TOKEN(isUser);

            // Destructuring to filter out sensitive information before sending it to client
            const { email, ...otherDetails } = isUser._doc;
            
            // Set the token as a cookie and send it in the response
            res.cookie('access_token', token, cookie_option).status(201).json(email);
        })
    } catch (error) {
        next(error);
    }
};


// Sign Out single user
// GET
export const SIGNOUT_USER = (req, res, next) => {
    try {
        res.cookie('access_token', '0', { ...cookie_option, maxAge: 1 }
        ).status(201).json('Sign Out Success');
    } catch (error) {
        next(error);
    }
};


// ========Below this line is code not available at client UI===========

// get all user
// GET
export const GET_ALL_USER = async (req, res, next) => {
    try {
        const getAllUser = await userModel.find();
        res.status(200).json(getAllUser);
    } catch (error) {
        next(error);
    }
};


// get a user by id
// GET
export const GET_USER = async (req, res, next) => {
    try {
        const { id } = req.params
        const getUser = await userModel.findById(id);

        // If user id not found
        if (!getUser) return next(createError(404, `Cannot get user with ID of ${id}`));
        
        res.status(200).json(getUser);
    } catch (error) {
        next(error);
    }
};

// Update a user
// PUT
export const UPDATE_USER = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, 
            { $set: req.body }, 
            { new: true})

        // If user id not found
        if (!updatedUser) return next(createError(404, `Cannot update user with ID of ${id}`));
        
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Delete a user
// DELETE
export const DELETE_USER = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedUser = await userModel.findByIdAndDelete(id)

        // If user id not found
        if (!deletedUser) return next(createError(404, `Cannot delete user with ID of ${id}`))
        
        res.status(200).json(deletedUser);
    } catch (error) {
        next(error);
    }
};