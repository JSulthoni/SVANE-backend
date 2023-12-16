import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        title : String,
        subcategories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
    }
)

export default mongoose.model('Category', categorySchema);
