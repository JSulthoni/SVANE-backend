import mongoose from "mongoose";

const subcategorySchema = mongoose.Schema(
    {
        title : String,
        subcategory : [String]
    }
)

export default mongoose.model('Subcategory', subcategorySchema)
