import express from 'express';
const router = express.Router();
import { CREATE_CATEGORY, DELETE_CATEGORY, GET_ALL_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY } from '../controller/categoryControl.js';
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { VERIFY_ADMIN } from '../utils/verifySecrets.js';

// get all product category
// GET
router.get('/', VERIFY_HEADER, GET_ALL_CATEGORY);

// get product category by id
// GET
router.get('/get/:id', VERIFY_HEADER, GET_CATEGORY);

// update a product category
// PUT
router.put('/put/:id',  VERIFY_HEADER, VERIFY_ADMIN, UPDATE_CATEGORY);

// create a product category
// POST
router.post('/post/',  VERIFY_HEADER, VERIFY_ADMIN, CREATE_CATEGORY);

// delete a product category
// DELETE
router.delete('/delete/:id',  VERIFY_HEADER, VERIFY_ADMIN, DELETE_CATEGORY);

export default router;