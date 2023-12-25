import jwt from 'jsonwebtoken';
import createError from './createError.js';

// This function verify user's token. Only a user with valid credentials and logged in will pass this verification
export const VERIFY_TOKEN = async (req, res, next) => {
    const token = req.cookies.access_token;

    // If request doesn't include a token, it will deny authentication
    if (!token) return next(createError(401, 'You don\'t have a token!'));

    try {
        // This will verify if the token is valid
        const info = jwt.verify(token, process.env.JWT_SECRET_KEY_DO_NOT_PUBLISH);

        // If the token is valid, this will allow access to the route this function is appended to
        req.user = info;
        next();
    } catch (error) {
        return next(createError(403, 'Token is invalid or expired.'));
    }
};

// This function is used to verify users authorization verify user's token
export const VERIFY_USER = async (error, req, res, next) => {
    try {
        await VERIFY_TOKEN(req, res, async () => {
            // If statement to check if the requester id in the token is the same with the params or isAdmin
            // req.user refers to const token = jwt.sign at userControl.js
            if (req.user.id === req.params.id || req.user.isAdmin) {
                next();
            } else if (error) {
                // If the true condition is not met, it means the request is not from the one owning the ID or is not admin
                return next(createError(403, 'You are not authorized!'));
            }
        });
    } catch (error) {
        next(error);
    }
};

// This function is used to verify if user is admin
export const VERIFY_ADMIN = (error, req, res, next) => {
    VERIFY_TOKEN(req, res, next, () => {

        // If statement to check if the request is from isAdmin
        // req.user refer to const token = jwt.sign at userControl.js
        if (req.user.isAdmin) {
            next();

        } else if (error) {
            // If true condition is not met, it means the request is from not admin
            return next(createError(403, 'You are not admin!'));
        }
    })
};