import express from 'express';
const router = express.Router();
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { CREATE_USER, DELETE_USER, GET_ALL_USER, GET_USER, SIGNIN_USER, SIGNOUT_USER, UPDATE_USER } from '../controller/userControl.js';
import { VERIFY_ADMIN, VERIFY_TOKEN, VERIFY_USER } from '../utils/verifySecrets.js';

// Create new user
//POST
router.post('/register', VERIFY_HEADER, CREATE_USER);

// Sign in new user
// POST
router.post('/signin', VERIFY_HEADER, SIGNIN_USER);

// Sign out new user
// GET
router.get('/signout', VERIFY_HEADER, SIGNOUT_USER);

// Get all user
// GET
router.get('/', VERIFY_HEADER, VERIFY_ADMIN, GET_ALL_USER);

// Get a user by id
// GET
router.get('/get/:id',  VERIFY_HEADER, VERIFY_USER, GET_USER);

// Update a user
// PUT
router.put('/put/:id',  VERIFY_HEADER, VERIFY_USER, UPDATE_USER);

// Delete a user
// DELETE
router.delete('/delete/:id',  VERIFY_HEADER, VERIFY_USER, DELETE_USER);


// VERIFY ROUTES

// Verify user authentication
// This used to test wether the request has token, which is stored in the cookie.
router.get('/verify', VERIFY_TOKEN, (req, res, next) => {
    res.send(JSON.stringify({message: 'Hello, user. You have token and are authenticated'}))
});

// Verify user authentication
// This used to test whenever user wanted to access their own credentials, which will be appllied to other HTTP method
router.get('/verify/:id', VERIFY_USER, (req, res, next) => {
    res.send(JSON.stringify({message: 'Hello, user. You are logged in and authorized'}))
});

// Verify if user is admin
// This used to test whenever user is admin, which is stored in the cookie
router.get('/verifyadmin/:id', VERIFY_ADMIN, (req, res, next) => {
    res.send(JSON.stringify({message: 'Hello, user. You are logged in and you are admin'}))
});

export default router;