import productModel from '../models/productModel.js'
import createError from '../utils/createError.js';

// get all products
// GET

export const GET_ALL_PRODUCT = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const category = req.query.category || '';
        const type = req.query.type || 'all';
        const subcategory = req.query.subcategory || 'all';
        const maxPrice = req.query.price || 999;
        const sort = req.query.sort || 'asc';
        const limit = req.query.limit || 999;

        // This block of code sets the subcategory to 'all' if there arent gquery for subcategory
        let setSubcategory;
            if (subcategory) {
                setSubcategory = subcategory.split(',')
            } else {
                setSubcategory = 'all'
            }
        
        // This block of code set the default sortBy to 'asc'
        let sortBy = {};
            if (sort === 'asc' || sort === 'desc') {
                sortBy.price = sort;
            } else {
                sortBy.price = 'asc';
            }

        // This object is the base query parameter
        const query = {
            price: { $lte: maxPrice },
            subcategory: { $in: [...setSubcategory] },
            type: { $in: [type] },
        };

        // Check if search query search for trending/featured products
        // Else it will search products by its title
        // Options 'i' indicates case insensitivity
        const searchTerms = search.toLowerCase().split(' ');
            if (searchTerms.includes('trending') || searchTerms.includes('featured')) {
                query.type = { $in: searchTerms };
            } else {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { type: { $in: searchTerms } },
                ];
            };

        // This block of code checks if there are category query, if present
        // It will add new property to the query object
            if (category) {
                query.category = { $in: [category] };
            };

        const getAllProduct = await productModel
            .find(query)
            .sort(sortBy)
            .limit(parseInt(limit, 10)); // Parsing the limit to integer
        
        // If request is failed, this will run
        if (!getAllProduct) return next(createError(404, 'Failed to get all products'));    

        res.status(200).json(getAllProduct);
    } catch (error) {
        next(error);
    }
};


// get a product by id
// GET
export const GET_PRODUCT = async (req, res, next) => {
    try {
        const { id } = req.params
        const getProduct = await productModel.findById(id)

        // If request is failed or product id not found
        if (!getProduct) return next(createError(404, `Cannot get product with ID of ${id}`));

        res.status(200).json(getProduct);
    } catch (error) {
        next(error);
    }
};

// Update a product
// PUT
export const UPDATE_PRODUCT = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, 
            { $set: req.body }, 
            { new: true})

        // If request is failed or product id not found
        if (!updatedProduct) return next(createError(404, `Cannot update product with ID of ${id}`));

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// Update many product
// PUT
export const UPDATE_MANY_PRODUCTS = async (req, res, next) => {
    try {
        const updatePayload = req.body
        const updatedProducts = await Promise.all(
            updatePayload.map( async (update) => {
                const { _id, ...updateFields} = update;

                return await productModel.findByIdAndUpdate(
                    _id,
                    { $set: updateFields },
                    { new: true }
                )
            })
        );

        // If some id not found or any other properties did not match
        const notFound = updatedProducts.some((product) => !product)
        if (notFound) return next(createError(404, `Cannot update products with payload of ${updatePayload}`));

        res.status(200).json(updatedProducts);
    } catch (error) {
        next(error);
    }
};

// create a product
// POST
export const CREATE_PRODUCT = async (req, res, next) => {
    try {
        const createPayload = req.body;
        const createdProducts = await productModel.create(createPayload);

        // If post request is failed 
        if (!createdProducts) return next(createError(404, `Cannot create products with payload of ${createPayload}`));

        res.status(201).json(createdProducts);
    } catch(error) {
        next(error);
    }
};

// delete a product
// DELETE
export const DELETE_PRODUCT = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);

        // If product id not found
        if (!deletedProduct) return next(createError(404, `Cannot find and delete product with ID of ${id}`));

        res.status(200).json(deletedProduct);
    } catch (error) {
        next(error);
    }
};