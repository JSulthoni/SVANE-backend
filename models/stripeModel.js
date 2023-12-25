import mongoose from "mongoose";

const stripeSchema = mongoose.Schema(
    {   
        userId: {
            type: String,
            required: true,
        },
        stripeId: {
            type: String,
            required: true
        },
        products: {
            type: [
                {
                    product: {
                        type: {
                        _id: String,
                        title: String,
                        description: String,
                        image1: String,
                        price: Number
                        },
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true
                    }
                }
            ],
            required: true,
        }
    },
    {
        timestamps: true
    }
);
  

export default mongoose.model('Stripe', stripeSchema);