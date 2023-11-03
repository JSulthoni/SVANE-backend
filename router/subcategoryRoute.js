const router = require('express').Router()
const Subcategory = require('../models/subcategoryModel')

// get all subcategory
// GET
router.get('/', async (req, res) => {
    try {
    const title = req.query.title
        let subcategory;
        if (title) {
            subcategory = await Subcategory.find({
                title: {
                $in: [title]
                }
            })
        } else {
            subcategory = await Subcategory.find({})
        }
        res.status(200).json(subcategory)

    } catch (error) {
        res.status(500).json({message : error.message})
    }
})


// get a subcategory by id
// GET
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const subcategory = await Subcategory.findById(id)
        res.status(200).json(subcategory)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})


// update a subsubcategory
// PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const subcategory = await Subcategory.findByIdAndUpdate(id, req.body)
        // if not found
        if (!subcategory) {
            return res.status(404).json({message : `Cannot find subcategory with ID of ${id}`})
        }
        const updatedSubcategory = await Subcategory.findById(id)
        res.status(200).json(updatedSubcategory)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// create a subcategory
// POST
router.post('/', async (req, res) => {
    try {
        const subcategories = await Subcategory.create(req.body)
        res.status(201).json(subcategories)
    } catch(error) {
        res.status(500).json({message : error.message})
    }
})

// delete a product
// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const subcategory = await Subcategory.findByIdAndDelete(id)
        if (!subcategory) {
            return res.status(404).json({message : `Cannot find and delete subcategory with ID of ${id}`})
        }
        res.status(200).json(v)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router;