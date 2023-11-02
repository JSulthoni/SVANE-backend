const express = require('express')
const app = express()
app.use(express.json())
const router = require('express').Router()
const Product = require('../models/productModel')

// get all products
// GET
router.get('/', async (req, res) => {
    try {
        const category = req.query.category || ''
        let subcategory = req.query.subcategory || 'all'
        const maxPrice = req.query.price || 499
        const sort = req.query.sort || 'asc'

        // Currently it is hardcoded
        const subcategoryOption = ['tshirt','skirt','outer','glasses','hat']

    subcategory === 'all' 
        ? (subcategory = [...subcategoryOption]) 
        : (subcategory = req.query.subcategory.split(','))
    
        let sortBy = {};
        if (sort === 'asc' || sort === 'desc') {
        sortBy.price = sort;
        } else {
        sortBy.price = 'asc'; 
        }
    
        let products;
        if (category) {
            products = await Product.find({
                category : {
                    $in: [category]
                },
                price: {
                    $lte : maxPrice
                }             
            })
            .where('subcategory')
            .in([...subcategory])
            .sort(sortBy)
        } else {
            products = await Product.find({
                price: {
                    $lte : maxPrice
                }
            })
            .where('subcategory')
            .in([...subcategory])
            .sort(sortBy)
        }
        res.status(200).json(products)

    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// get a product by id
// GET
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const products = await Product.findById(id)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// update a product
// PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        // if product id not found
        if (!product) {
            return res.status(404).json({message : `Cannot find product with ID of ${id}`})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// create a product
// POST
router.post('/', async (req, res) => {
    try {
        const products = await Product.create(req.body)
        res.status(201).json(products)
    } catch(error) {
        res.status(500).json({message : error.message})
    }
})

// delete a product
// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({message : `Cannot find and delete product with ID of ${id}`})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router;