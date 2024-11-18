import { connectToDatabase } from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log('Mappings API called:', { method, id });

  try {
    await connectToDatabase();
    console.log('Connected to database');

    if (!id) {
      console.error('No ID provided');
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    // Verifica che l'ID sia valido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid ID format');
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    switch (method) {
      case 'GET':
        try {
          const recipe = await Recipe.findById(id).lean();
          console.log('Recipe found:', recipe ? 'yes' : 'no');
          
          if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
          }
          
          const mappings = recipe.ingredientMappings || {};
          console.log('Returning mappings:', mappings);
          return res.status(200).json(mappings);
        } catch (error) {
          console.error('GET Error:', error);
          throw error;
        }

      case 'POST':
        try {
          const { mappings } = req.body;
          console.log('Received mappings:', mappings);

          if (!mappings || typeof mappings !== 'object') {
            return res.status(400).json({ error: 'Invalid mappings data' });
          }

          const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: { ingredientMappings: mappings } },
            { new: true, runValidators: true }
          ).lean();

          if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
          }

          console.log('Updated mappings:', updatedRecipe.ingredientMappings);
          return res.status(200).json(updatedRecipe.ingredientMappings || {});
        } catch (error) {
          console.error('POST Error:', error);
          throw error;
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
}