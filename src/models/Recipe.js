import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String,
    isDivider: Boolean
  }],
  procedure: {
    type: String,
    required: [true, 'Il procedimento è obbligatorio']
  },
  ingredientMappings: {
    type: Map,
    of: String,
    default: {}
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

// Aggiorna updatedAt prima di ogni salvataggio
RecipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);