import { connectToDatabase } from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log('API called with method:', method, 'for recipe:', id);

  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');

    switch (method) {
      case 'GET':
        try {
          console.log('Finding recipe...');
          const recipe = await Recipe.findById(id).lean();
          console.log('Recipe found:', recipe);
          
          if (!recipe) {
            console.log('Recipe not found');
            return res.status(404).json({ error: 'Ricetta non trovata' });
          }
          
          // Assicuriamoci di ritornare sempre un oggetto valido
          const mappings = recipe.ingredientMappings || {};
          console.log('Returning mappings:', mappings);
          res.status(200).json(mappings);
        } catch (error) {
          console.error('GET Error:', error);
          throw error;
        }
        break;

      case 'POST':
        try {
          // Validazione input
          if (!req.body.mappings || typeof req.body.mappings !== 'object') {
            console.error('Invalid mappings data received:', req.body);
            return res.status(400).json({ error: 'Invalid mappings data' });
          }

          console.log('Received mappings:', req.body.mappings);

          // Aggiornamento usando il nuovo formato
          const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: { ingredientMappings: req.body.mappings } },
            { new: true, runValidators: true }
          ).lean();

          if (!updatedRecipe) {
            console.log('Recipe not found for update');
            return res.status(404).json({ error: 'Ricetta non trovata' });
          }

          const savedMappings = updatedRecipe.ingredientMappings || {};
          console.log('Saved mappings:', savedMappings);
          
          res.status(200).json(savedMappings);
        } catch (error) {
          console.error('POST Error:', error);
          throw error;
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}