import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  waferText: String,
  waferDesign: String,
  notes: String,
  customerName: {
    type: String,
    required: true,
  },
  customerContact: {
    type: String,
    required: true,
  },
  deposit: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);