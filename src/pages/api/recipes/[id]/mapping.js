import { connectToDatabase } from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log('API Request:', { method, id });

  if (!id) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          console.log('Finding recipe...');
          const recipe = await Recipe.findById(id);
          
          if (!recipe) {
            console.log('Recipe not found');
            return res.status(404).json({ error: 'Recipe not found' });
          }
          
          console.log('Found recipe:', recipe._id);
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
          console.log('Received mappings data:', mappings);
          
          if (!mappings || typeof mappings !== 'object') {
            console.error('Invalid mappings data received:', req.body);
            return res.status(400).json({ error: 'Invalid mappings data' });
          }

          const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: { ingredientMappings: mappings } },
            { new: true, runValidators: true }
          );

          if (!updatedRecipe) {
            console.log('Recipe not found for update');
            return res.status(404).json({ error: 'Recipe not found' });
          }

          console.log('Updated recipe:', updatedRecipe._id);
          console.log('New mappings:', updatedRecipe.ingredientMappings);
          
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
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}