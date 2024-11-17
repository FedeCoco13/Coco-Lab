import { connectToDatabase } from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          const recipe = await Recipe.findById(id).lean();
          if (!recipe) {
            return res.status(404).json({ error: 'Ricetta non trovata' });
          }
          
          // Assicuriamoci di ritornare sempre un oggetto valido
          const mappings = recipe.ingredientMappings || {};
          console.log('GET Mappings:', mappings); // Log per debug
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
            return res.status(400).json({ error: 'Invalid mappings data' });
          }

          console.log('Received mappings:', req.body.mappings); // Log per debug

          // Aggiornamento usando il nuovo formato
          const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: { ingredientMappings: req.body.mappings } },
            { new: true, runValidators: true }
          ).lean();

          if (!updatedRecipe) {
            return res.status(404).json({ error: 'Ricetta non trovata' });
          }

          const savedMappings = updatedRecipe.ingredientMappings || {};
          console.log('Saved mappings:', savedMappings); // Log per debug
          
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