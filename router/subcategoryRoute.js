import express from 'express';
import { CREATE_SUBCATEGORY, DELETE_SUBCATEGORY, GET_ALL_SUBCATEGORY, GET_SUBCATEGORY, UPDATE_SUBCATEGORY } from '../controller/subcategoryControl.js';
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { VERIFY_ADMIN } from '../utils/verifySecrets.js';
const router = express.Router();

// get all subcategory
// GET
router.get('/', VERIFY_HEADER, GET_ALL_SUBCATEGORY);

// get a subcategory by id
// GET
router.get('/get/:id', VERIFY_HEADER, GET_SUBCATEGORY);

// update a subcategory
// PUT
router.put('/put/:id', VERIFY_ADMIN, UPDATE_SUBCATEGORY);

// create a subcategory
// POST
router.post('/post/', VERIFY_ADMIN, CREATE_SUBCATEGORY);

// delete a subcategory
// DELETE
router.delete('/delete/:id', VERIFY_ADMIN, DELETE_SUBCATEGORY);

export default router;