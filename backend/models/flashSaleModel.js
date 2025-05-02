import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      salePrice: { type: Number, required: true },
      discountPercent: { type: Number, required: true } 
    }
  ],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: false }
});

const FlashSaleModel = mongoose.model("FlashSale", flashSaleSchema);
export default FlashSaleModel;