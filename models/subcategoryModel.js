const mongoose = require('mongoose')

const subcategorySchema = mongoose.Schema(
    {
        title : String,
        subcategory : [String]
    }
)

const Product = mongoose.model('subcategory', subcategorySchema)

module.exports = Product;