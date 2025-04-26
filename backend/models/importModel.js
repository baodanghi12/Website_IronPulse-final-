import mongoose from 'mongoose';

const importSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      cost: { type: Number, required: true },
      sizes: [
        {
          size: { type: String, required: true },
          quantity: { type: Number, required: true },
        }
      ]
    }
  ],
  totalCost: { type: Number, required: true },
  importDate: { type: Date, default: Date.now },
  note: { type: String }
});


const Import = mongoose.model('Import', importSchema);

export default Import;
