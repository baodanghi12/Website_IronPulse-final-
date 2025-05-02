// promotionModel.js
import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    numOfAvailable: { type: Number, required: true },
    value: { type: Number, required: true },
    type: { type: String, enum: ['percent', 'amount'], required: true },
    

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
