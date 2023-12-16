import express from 'express';
import { CREATE_CATEGORY, DELETE_CATEGORY, GET_ALL_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY } from '../controller/categoryControl.js';
import VERIFY_HEADER from '../utils/verifyHeader.js';
import { VERIFY_ADMIN } from '../utils/verifySecrets.js';
const router = express.Router()

// get all category
// GET
router.get('/', VERIFY_HEADER, GET_ALL_CATEGORY)

// get a category by id
// GET
router.get('/get/:id', VERIFY_HEADER, GET_CATEGORY)

// update a category
// PUT
router.put('/put/:id', VERIFY_ADMIN, UPDATE_CATEGORY)

// create a category
// POST
router.post('/post/', VERIFY_ADMIN, CREATE_CATEGORY)

// delete a category
// DELETE
router.delete('/delete/:id', VERIFY_ADMIN, DELETE_CATEGORY)

export default router;