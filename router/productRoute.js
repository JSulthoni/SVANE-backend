import express from 'express'
import { CREATE_PRODUCT, DELETE_PRODUCT, GET_ALL_PRODUCT, GET_PRODUCT, UPDATE_MANY_PRODUCTS, UPDATE_PRODUCT } from '../controller/productControl.js'
const router = express.Router()

// get all products
// GET
router.get('/', GET_ALL_PRODUCT)

// get a product by id
// GET
router.get('/find/:id', GET_PRODUCT)

// Update a product
// PUT
router.put('/update/:id', UPDATE_PRODUCT)

// Update many products
// PUT
router.put('/updatemany/', UPDATE_MANY_PRODUCTS)

// create a product
// POST
router.post('/create/', CREATE_PRODUCT)

// delete a product
// DELETE
router.delete('/delete/:id', DELETE_PRODUCT)

export default router;