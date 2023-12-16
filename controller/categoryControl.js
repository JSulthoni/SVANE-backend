import categoryModel from "../models/categoryModel.js";
import createError from "../utils/createError.js";

// get all category
// GET
export const GET_ALL_CATEGORY = async (req, res, next) => {
    const title = req.query.title
    try {
        let allCategory;
        if (title) {
            allCategory = await categoryModel.find({
                title: {
                $in: [title]
                }
            }).populate('subcategories', 'title'); // Populate subcategories with titles
        } else {
            allCategory = await categoryModel.find({}).populate('subcategories', 'title'); // Populate subcategories with titles
        }

        // Throws error if request failed
        if (!allCategory) return next(createError(404, 'Failed to get categories'));   

        res.status(200).json(allCategory);
    } catch (error) {
        next(error);
    }
};


// get a category by id
// GET
export const GET_CATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id).populate('subcategories', 'title'); // Populate subcategories with titles

        // Throws error if category is not found with requested id
        if (!category) return next(createError(404, `Cannot get category with ID of ${id}`));

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};


// update a category
// PUT
export const UPDATE_CATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, req.body, {new: true})
        
        // Throws error if update target is not found
        if (!updatedCategory) return next(createError(404, `Cannot update category with ID of ${id}`));
        
        // Update corresponding categories
        const subcategoryUpdatePromises = updatedCategory.subcategories.map( async (subcategoryId) => {
            const subcategory = await categoryModel.findById(subcategoryId);

            if (subcategory) {
                // Update the corresponding subcategory 
                subcategory.categories = subcategory.categories.filter(categoryId => categoryId.toString() !== id);
                await subcategory.save();
            } else {
                return next(createError(404, `Cannot find subcategory with ID of ${subcategoryId}`));
            }
        });
        await Promise.all(subcategoryUpdatePromises);

        res.status(200).json(updatedCategory)
    } catch (error) {
        next(error);
    }
};

// create a category
// POST
export const CREATE_CATEGORY = async (req, res, next) => {
    try {
        const createPayload= await req.body;
        const createdCategory = await categoryModel.create(createPayload);

        // Throws error if create function failed
        if (!createdCategory) return next(createError(404, `Cannot create category with payload of ${createPayload}`));

        res.status(201).json(createdCategory);
    } catch(error) {
        next(error);
    }
};

// delete a Category
// DELETE
export const DELETE_CATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        // Throws error if category id is not found
        if (!deletedCategory) return next(createError(404, `Cannot find and delete category with ID of ${id}`));
        
        // Update corresponding categories
        const subcategoryUpdatePromises = deletedCategory.subcategories.map( async (subcategoryId) => {
            const subcategory = await categoryModel.findById(subcategoryId);

            if (subcategory) {
                // Update the corresponding subcategory 
                subcategory.categories = subcategory.categories.filter(categoryId => categoryId.toString() !== id);
                await subcategory.save();
            } else {
                return next(createError(404, `Cannot find subcategory with ID of ${subcategoryId}`));
            }
        });
        await Promise.all(subcategoryUpdatePromises);

        res.status(200).json(deletedCategory);
    } catch (error) {
        next(error);
    }
};
