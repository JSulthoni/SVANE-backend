import express from 'express';
const router = express.Router();
import { CREATE_SUBCATEGORY, DELETE_SUBCATEGORY, GET_ALL_SUBCATEGORY, GET_SUBCATEGORY, UPDATE_SUBCATEGORY } from '../controller/subcategoryControl.js';
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { VERIFY_ADMIN } from '../utils/verifySecrets.js';

// get all product subcategory
// GET
router.get('/', VERIFY_HEADER, GET_ALL_SUBCATEGORY);

// get a product subcategory by id
// GET
router.get('/get/:id', VERIFY_HEADER, GET_SUBCATEGORY);

// update a product subcategory
// PUT
router.put('/put/:id',  VERIFY_HEADER, VERIFY_ADMIN, UPDATE_SUBCATEGORY);

// create a product subcategory
// POST
router.post('/post/',  VERIFY_HEADER, VERIFY_ADMIN, CREATE_SUBCATEGORY);

// delete a product subcategory
// DELETE
router.delete('/delete/:id',  VERIFY_HEADER, VERIFY_ADMIN, DELETE_SUBCATEGORY);

export default router;