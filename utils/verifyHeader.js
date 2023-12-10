import createError from "./createError.js";

const VERIFY_HEADER = (error, req, res, next) => {
    const headers = req.headers

    // If request dont have header, it will deny access
    if (!headers) {
        return next(createError(403, 'ACCESS FORBIDDEN'));
    } else if (headers){
        console.log('Authorization: ', headers.Authorization)
        next();
    }
};

export default VERIFY_HEADER;