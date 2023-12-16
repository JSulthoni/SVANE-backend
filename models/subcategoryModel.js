import mongoose from "mongoose";

const subcategorySchema = mongoose.Schema(
    {
        title : String,
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    }
)

export default mongoose.model('Subcategory', subcategorySchema);