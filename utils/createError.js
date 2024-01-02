// This function is to create new error based on the argument passed
const createError = (status, message) => {
    const error = new Error();
    error.status = status;
    error.message = message;

    // Omit stack trace in client responses
    const clientError = Object.assign({}, error);
    clientError.stack = null;

    return clientError;
};

export default createError;