import express from 'express';
import { CREATE_SUBCATEGORY, DELETE_SUBCATEGORY, GET_ALL_SUBCATEGORY, GET_SUBCATEGORY, UPDATE_SUBCATEGORY } from '../controller/subcategoryControl.js';
const router = express.Router()

// get all subcategory
// GET
router.get('/', GET_ALL_SUBCATEGORY)

// get a subcategory by id
// GET
router.get('/find/:id', GET_SUBCATEGORY)

// update a subcategory
// PUT
router.put('/update/:id', UPDATE_SUBCATEGORY)

// create a subcategory
// POST
router.post('/create/', CREATE_SUBCATEGORY)

// delete a subcategory
// DELETE
router.delete('/delete/:id', DELETE_SUBCATEGORY)

export default router;