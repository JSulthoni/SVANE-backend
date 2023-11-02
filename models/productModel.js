const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image1: {
            type: String,
            required: true,
        },
        image2: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        newArrival: {
            type: Boolean,
            default: false
        },
        category: {
            type: [String],
            required: true,
        },
        subcategory: {
            type: [String],
            default: [],
        },
        type: {
            type: [String],
            default: []
        },
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product;