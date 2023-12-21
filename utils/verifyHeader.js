import createError from "./createError.js";

const VERIFY_HEADER = (req, res, next) => {
    const SERVER_API_KEY = process.env.VITE_MONGO_API_KEY
    try {
        // If request dont have header or does not provide key, it will deny access
        const headers = req.headers
        const CLIENT_API_KEY = headers.authorization.split(' ')[1];
        if (CLIENT_API_KEY === SERVER_API_KEY) {
            next();
        }
    } catch (error) {
        return next(createError(403, 'ACCESS FORBIDDEN'));
    }
};

export default VERIFY_HEADER;