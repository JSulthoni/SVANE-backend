import mongoose from "mongoose";

const stripeSchema = mongoose.Schema(
    {
        stripeid: {
            type: String,
            required: true
        },
        products: {
            type: [{
                id: String,
                title: String,
                price: Number,
                quantity: Number
            }],
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Stripe', stripeSchema)