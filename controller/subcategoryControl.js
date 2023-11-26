import subcategoryModel from "../models/subcategoryModel.js";

// get all subcategory
// GET
export const GET_ALL_SUBCATEGORY = async (req, res, next) => {
    try {
    const title = req.query.title
        let subcategory;
        if (title) {
            subcategory = await subcategoryModel.find({
                title: {
                $in: [title]
                }
            })
        } else {
            subcategory = await subcategoryModel.find({})
        }
        res.status(200).json(subcategory)
    } catch (error) {
        next(error)
    }
};


// get a subcategory by id
// GET
export const GET_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const subcategory = await subcategoryModel.findById(id)
        res.status(200).json(subcategory)
    } catch (error) {
        next(error)
    }
};


// update a subcategory
// PUT
export const UPDATE_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const subcategory = await subcategoryModel.findByIdAndUpdate(id, req.body)
        // if update target is not found
        if (!subcategory) {
            return res.status(404).json({message : `Cannot find subcategory with ID of ${id}`})
        }
        const updatedSubcategory = await subcategoryModel.findById(id)
        res.status(200).json(updatedSubcategory)
    } catch (error) {
        next(error)
    }
};

// create a subcategory
// POST
export const CREATE_SUBCATEGORY = async (req, res, next) => {
    try {
        const createdSubcategory = await subcategoryModel.create(req.body)
        res.status(201).json(createdSubcategory)
    } catch(error) {
        next(error)
    }
};

// delete a subcategory
// DELETE
export const DELETE_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedSubcategory = await subcategoryModel.findByIdAndDelete(id)
        if (!deletedSubcategory) {
            return res.status(404).json({message : `Cannot find and delete subcategory with ID of ${id}`})
        }
        res.status(200).json(deletedSubcategory)
    } catch (error) {
        next(error)
    }
};
