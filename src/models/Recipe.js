import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String,
    isDivider: Boolean
  }],
  procedure: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);