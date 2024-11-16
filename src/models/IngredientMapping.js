import mongoose from 'mongoose';

const IngredientMappingSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: String,
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pre-save per aggiornare updatedAt
IngredientMappingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.IngredientMapping || mongoose.model('IngredientMapping', IngredientMappingSchema);