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
  // Modifichiamo la struttura delle associazioni per una migliore serializzazione
  ingredientMappings: {
    type: Object,
    default: {},
    get: function(data) {
      return data ? JSON.parse(JSON.stringify(data)) : {};
    },
    set: function(data) {
      return data ? JSON.parse(JSON.stringify(data)) : {};
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
  // Aggiungiamo queste opzioni per gestire meglio la serializzazione
  toJSON: {
    getters: true,
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.ingredientMappings) {
        ret.ingredientMappings = JSON.parse(JSON.stringify(ret.ingredientMappings));
      }
      return ret;
    }
  },
  toObject: {
    getters: true,
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.ingredientMappings) {
        ret.ingredientMappings = JSON.parse(JSON.stringify(ret.ingredientMappings));
      }
      return ret;
    }
  }
});

// Aggiorna updatedAt prima di ogni salvataggio
RecipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);