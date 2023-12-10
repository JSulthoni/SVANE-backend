import jwt from 'jsonwebtoken';
import createError from './createError.js';

export const VERIFY_TOKEN = (req, res, next) => {
    const token = req.cookies.access_token;

    // If requester dont have token, it will deny authentication
    if (!token) return next(createError(401, 'You dont have token!'));

    // This will verify if the token is valid
    jwt.verify(token, process.env.JWT_SECRET_KEY_DO_NOT_PUBLISH, (error, info) => {
        if (error) return next(createError(403, 'Yes, you have token but invalid!'));

        // If token is valid, this will allow access to the route this function is appended
        req.user = info;
        next();
    })
};

export const VERIFY_USER = (error, req, res, next) => {
    VERIFY_TOKEN(req, res, next, () => {

        // If statement to check if the requester id in the token is the same with the params or isAdmin
        // req.user refer to const token = jwt.sign at userControl.js
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();

        } else if (error) {
            // If true condition is not met, it means the requester is not the one owning the ID or is not admin
            return next(createError(403, 'You are not authorized!'));
        }
    })
}

export const VERIFY_ADMIN = (error, req, res, next) => {
    VERIFY_TOKEN(req, res, next, () => {

        // If statement to check if the requester isAdmin
        // req.user refer to const token = jwt.sign at userControl.js
        if (req.user.isAdmin) {
            next();

        } else if (error) {
            // If true condition is not met, it means the requester is not admin
            return next(createError(403, 'You are not admin!'));
        }
    })
}