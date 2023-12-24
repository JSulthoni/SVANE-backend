import mongoose from 'mongoose';
import stripeModel from './models/stripeModel';


const existingRecords = await stripeModel.find();

for (const record of existingRecords) {
  const updatedProducts = record.products.map(item => ({
    product: {
      _id: item._id,
      title: item.title,
      description: item.description || '',
      price: item.price,
      image1: item.image1 || ''
    },
    quantity: item.quantity
  }));

  await stripeModel.updateOne({ _id: record._id }, { $set: { products: updatedProducts } });
}
