import mongoose from 'mongoose';

// Schema per gli elementi salati
const SavoryItemSchema = new mongoose.Schema({
  item: String,
  quantity: String
});

const OrderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: String,
  waferText: String,
  waferDesign: String,
  notes: String,
  customerName: {
    type: String,
    required: true
  },
  customerContact: {
    type: String,
    required: true
  },
  deposit: String,
  printed: {
    type: Boolean,
    default: false
  },
  // Nuovi campi aggiunti
  hasAllergies: {
    type: Boolean,
    default: false
  },
  allergies: String,
  savoryItems: [SavoryItemSchema], // Array di prodotti salati
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);