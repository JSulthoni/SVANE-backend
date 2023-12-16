import subcategoryModel from "../models/subcategoryModel.js";
import categoryModel from "../models/categoryModel.js";
import createError from "../utils/createError.js";

// get all subcategory
// GET
export const GET_ALL_SUBCATEGORY = async (req, res, next) => {
    const title = req.query.title
    try {
        let allSubcategory;
        if (title) {
            allSubcategory = await subcategoryModel.find({
                title: {
                $in: [title]
                }
            }).populate('categories', 'title');
        } else {
            allSubcategory = await subcategoryModel.find({}).populate('categories', 'title');
        }

        // Throws error if request failed
        if (!allSubcategory) return next(createError(404, 'Failed to get subcategories'));   

        res.status(200).json(allSubcategory);
    } catch (error) {
        next(error);
    }
};


// get a subcategory by id
// GET
export const GET_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const subcategory = await subcategoryModel.findById(id).populate('categories', 'title');

        // Throws error if category is not found with requested id
        if (!subcategory) return next(createError(404, `Cannot get subcategory with ID of ${id}`));

        res.status(200).json(subcategory);
    } catch (error) {
        next(error);
    }
};


// update a subcategory
// PUT
export const UPDATE_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(id, req.body, { new: true });
       
        // if update target is not found
        if (!updatedSubcategory) return next(createError(404, `Cannot update subcategory with ID of ${id}`));
            
        // Update corresponding categories
        const categoryUpdatePromises = updatedSubcategory.categories.map(async (categoryId) => {
            const category = await categoryModel.findById(categoryId);

            if (category) {
                // Update the category here based on your requirements
                // For example, you might want to update the category's updatedAt field
                category.updatedAt = new Date();
                await category.save();
            } else {
                return next(createError(404, `Cannot find category with ID of ${categoryId}`));
            }
        });
        await Promise.all(categoryUpdatePromises);


        res.status(200).json(updatedSubcategory);
    } catch (error) {
        next(error);
    }
};

// create a subcategory
// POST
export const CREATE_SUBCATEGORY = async (req, res, next) => {
    let createdSubcategory;

    try {
        const createPayload = await req.body;

        // Create the subcategory
        createdSubcategory = await subcategoryModel.create({
            title: createPayload.title,
            categories: [], // Initialize with an empty array
        });

        // Loop through the array of categories to associate the subcategory
        for (const category of createPayload.categories) {
            // Find the corresponding category
            const getCategory = await categoryModel.findOne({ title: category });

            // If the category is found, update the associations
            if (getCategory) {
                getCategory.subcategories.push(createdSubcategory._id);
                createdSubcategory.categories.push(getCategory._id);
                await getCategory.save();
            } else {
                // If the category is not found, break operation and return an error
                return next(createError(404, `Cannot find category of ${category}`));
            }
        };

        // Save the created subcategory with updated associations
        await createdSubcategory.save();


        if (!createdSubcategory) {
            // Handle the case if create function failed
            return next(createError(404, `Cannot create subcategory with payload of ${createPayload}`));
        }

        // Respond with the created subcategory
        res.status(201).json(createdSubcategory);
    } catch (error) {
        next(error);
    }
};

// delete a subcategory
// DELETE
export const DELETE_SUBCATEGORY = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedSubcategory = await subcategoryModel.findByIdAndDelete(id);

        // Throws error if subcategory id is not found
        if (!deletedSubcategory) return next(createError(404, `Cannot find and delete subcategory with ID of ${id}`));
        
        // Update corresponding categories
        const categoryUpdatePromises = deletedSubcategory.categories.map( async (categoryId) => {
            const category = await categoryModel.findById(categoryId);

            if (category) {
                // Update the subcategories array in category document
                category.subcategories = category.subcategories.filter(subcategoryId => subcategoryId.toString() !== id);
                await category.save();
            } else {
                return next(createError(404, `Cannot find category with ID of ${categoryId}`));
            }
        });
        await Promise.all(categoryUpdatePromises);

        res.status(200).json(deletedSubcategory);
    } catch (error) {
        next(error);
    }
};