import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  supplier: String,
  iva: String,
  priceHistory: [{
    date: String,
    price: Number,
    quantity: Number,
    discounts: [Number]
  }]
});

const InvoiceSchema = new mongoose.Schema({
  date: String,
  supplier: String,
  fileName: String,
  products: [ProductSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);