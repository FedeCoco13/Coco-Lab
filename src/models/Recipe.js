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
    type: Object,
    default: {},
    // Assicuriamoci che le mappature vengano serializzate correttamente
    get: function(data) {
      try {
        return typeof data === 'object' ? data : {};
      } catch (e) {
        return {};
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Middleware pre-save per aggiornare updatedAt
RecipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Assicuriamoci che le mappature vengano salvate correttamente
RecipeSchema.pre('findOneAndUpdate', function(next) {
  if (this._update.$set && this._update.$set.ingredientMappings) {
    // Validiamo che sia un oggetto valido
    if (typeof this._update.$set.ingredientMappings !== 'object') {
      next(new Error('ingredientMappings must be an object'));
      return;
    }
  }
  next();
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);