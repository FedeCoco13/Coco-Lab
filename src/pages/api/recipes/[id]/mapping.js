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
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ error: 'Ricetta non trovata' });
        }
        
        // Converti la Map in un oggetto normale
        const mappings = Object.fromEntries(recipe.ingredientMappings || new Map());
        res.status(200).json(mappings);
        break;

      case 'POST':
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          { 
            $set: { 
              ingredientMappings: req.body.mappings,
              updatedAt: new Date()
            } 
          },
          { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
          return res.status(404).json({ error: 'Ricetta non trovata' });
        }

        console.log('Mappings saved:', {
          recipeId: id,
          mappingsCount: Object.keys(req.body.mappings).length,
        });

        // Converti la Map in un oggetto normale per la risposta
        const updatedMappings = Object.fromEntries(updatedRecipe.ingredientMappings || new Map());
        res.status(200).json(updatedMappings);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}