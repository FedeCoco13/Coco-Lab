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
  date: String,
  priceHistory: [{
    date: String,
    price: Number,
    quantity: Number,
    discounts: [Number]
  }]
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
  fileName: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  products: [ProductSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);