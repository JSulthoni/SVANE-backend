import productModel from '../models/productModel.js'

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

        // This object is the query parameter
        // option 'i' indicates case insensitivity
        const query = {
            price: { $lte: maxPrice },
            subcategory: { $in: [...setSubcategory] },
            type: { $in: [type] },
        };

        // Check if search query search for trending/featured products
        // Else it will search products by its title
        if (search.toLowerCase() === 'trending') {
            query.type = { $in: ['trending'] };
        } else if (search.toLowerCase() === 'featured') {
            query.type = { $in: ['featured'] };
        } else {
            query.title= { $regex: search, $options: 'i' };
        }

        // This block of code checks if there are category query, if present
        // It will add new property to the query object
            if (category) {
                query.category = { $in: [category] };
            }

        const getAllProduct = await productModel
            .find(query)
            .sort(sortBy)
            .limit(parseInt(limit, 10)); // Parsing the limit to integer

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
        res.status(200).json(getProduct)
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

        // If product id not found
        if (!updatedProduct) {
            return res.status(404).json({message : `Cannot find product with ID of ${id}`})
        }

        res.status(200).json(updatedProduct)
    } catch (error) {
        next(error);
    }
};

// Update many product
// PUT
export const UPDATE_MANY_PRODUCTS = async (req, res, next) => {
    try {
        const updateProducts = req.body
        const updatedProducts = await Promise.all(
            updateProducts.map(async (update) => {
                const { _id, ...updateFields} = update;

                return await productModel.findByIdAndUpdate(
                    _id,
                    { $set: updateFields },
                    { new: true }
                )
            })
        );

        // If id not found or any other properties did not match
        const notFound = updatedProducts.some((product) => !product)
        if (notFound) {
            return res.status(404).json({message : `some products not found`})
        }
    } catch (error) {
        next(error);
    }
};

// create a product
// POST
export const CREATE_PRODUCT = async (req, res, next) => {
    try {
        const products = await productModel.create(req.body)
        res.status(201).json(products)
    } catch(error) {
        next(error);
    }
};

// delete a product
// DELETE
export const DELETE_PRODUCT = async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await productModel.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({message : `Cannot find and delete product with ID of ${id}`})
        }
        res.status(200).json(product)
    } catch (error) {
        next(error);
    }
};