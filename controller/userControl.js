import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from "../utils/createError.js";


// Create a new user and issue a token upon successful account creation
// POST
export const CREATE_USER = async (req, res, next) => {
    const body = await req.body;
    try {
        // Using bcryptjs to hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);

        // Creating new user
        const createdUser = await userModel.create({
            email: body.email,
            password: hash
        });

        if (!createdUser) return next(createError(500, 'Failed to create an account'));

        // Create a token for the newly created user
        const token = jwt.sign(
            { id: createdUser._id, isAdmin: createdUser.isAdmin, isSeller: createdUser.isSeller },
            process.env.JWT_SECRET_KEY_DO_NOT_PUBLISH
        );

        const { password, isAdmin, isSeller, ...otherDetails } = createdUser._doc;

        // Set the token as a cookie and send it in the response
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(201).json({ ...otherDetails });
    } catch (error) {
        next(error);
    }
};


// Sign In single user
// POST
export const SIGNIN_USER = async (req, res, next) => {
    const body = await req.body;
    try {

        // Finding user in database based on email on body
        const isUser =  await userModel.findOne({ email: body.email });
        if (!isUser) return next(createError(404, 'Credentials not found'));
        
        // Comparing password from db and body by using bcryptjs
        // Remember that password stored in db is hashed
        const isPassword = await bcrypt.compare(body.password, isUser.password);
        if (!isPassword) return next(createError(400, 'Invalid credentials'));

        // Create a token that will be send to user if request is successful
        const token = jwt.sign({ id: isUser._id, isAdmin: isUser.isAdmin, isSeller: isUser.isSeller }, 
            process.env.JWT_SECRET_KEY_DO_NOT_PUBLISH
        );

        const { password, isAdmin, isSeller, ...otherDetails } = isUser._doc;
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(201).json({...otherDetails});
    } catch (error) {
        next(error);
    }
};


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