import express from 'express';
const router = express.Router();
import { CREATE_PRODUCT, DELETE_PRODUCT, GET_ALL_PRODUCT, GET_PRODUCT, UPDATE_MANY_PRODUCTS, UPDATE_PRODUCT } from '../controller/productControl.js';
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { VERIFY_USER } from '../utils/verifySecrets.js';

// get all products
// GET
router.get('/', VERIFY_HEADER, GET_ALL_PRODUCT);

// get a product by id
// GET
router.get('/get/:id', VERIFY_HEADER, GET_PRODUCT);

// Update a product
// PUT
router.put('/put/:id',  VERIFY_HEADER, VERIFY_USER, UPDATE_PRODUCT);

// Update many products
// PUT
router.put('/putmany/',  VERIFY_HEADER, VERIFY_USER, UPDATE_MANY_PRODUCTS);

// create a product
// POST
router.post('/post/',  VERIFY_HEADER, VERIFY_USER, CREATE_PRODUCT);

// delete a product
// DELETE
router.delete('/delete/:id',  VERIFY_HEADER, VERIFY_USER, DELETE_PRODUCT);

export default router;