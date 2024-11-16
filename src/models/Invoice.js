import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: String,
  supplier: {
    type: String,
    required: true
  },
  iva: {
    type: String,
    required: true
  },
  discounts: [Number],
  date: String
});

const InvoiceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  fileName: String,
  file: String,
  products: [ProductSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);