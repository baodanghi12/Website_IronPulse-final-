  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: [
      {
        size: { type: String, required: false },
        quantity: { type: Number, default: 0 },
      }
    ],
    cost: { type: Number, default: 0 },
    newArrival: { type: Boolean, default: false },
    date: { type: Number, required: true },
    colors: [String],
  });

  const productModel = mongoose.models.product || mongoose.model("Product", productSchema);

  export default productModel;