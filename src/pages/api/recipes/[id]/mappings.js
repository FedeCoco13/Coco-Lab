import { connectToDatabase } from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log('Mappings API called:', { method, id, body: req.body });

  try {
    await connectToDatabase();

    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    switch (method) {
      case 'GET':
        try {
          const recipe = await Recipe.findById(id);
          if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
          }
          
          const mappings = recipe.ingredientMappings || {};
          console.log('Returning mappings:', mappings);
          return res.status(200).json(mappings);
        } catch (error) {
          console.error('GET Error:', error);
          return res.status(500).json({ error: error.message });
        }

      case 'POST':
        try {
          const { mappings } = req.body;
          console.log('Received mappings to save:', mappings);

          if (!mappings || typeof mappings !== 'object') {
            return res.status(400).json({ error: 'Invalid mappings data' });
          }

          // Utilizziamo findOneAndUpdate per aggiornare le mappature
          const updatedRecipe = await Recipe.findOneAndUpdate(
            { _id: id },
            { $set: { ingredientMappings: mappings } },
            { 
              new: true,         // Ritorna il documento aggiornato
              runValidators: true // Esegue i validatori
            }
          );

          if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
          }

          console.log('Successfully updated mappings:', updatedRecipe.ingredientMappings);
          return res.status(200).json(updatedRecipe.ingredientMappings);
        } catch (error) {
          console.error('POST Error:', error);
          return res.status(500).json({ error: error.message });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}