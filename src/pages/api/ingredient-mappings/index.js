import { connectToDatabase } from '../../../lib/mongodb';
import IngredientMapping from '../../../models/IngredientMapping';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const mappings = await IngredientMapping.find({})
          .sort({ ingredientName: 1 })
          .lean();
        res.status(200).json(mappings);
        break;

      case 'POST':
        const { mappings: newMappings, recipeId } = req.body;
        
        // Primo eliminiamo le vecchie associazioni per questa ricetta se esistono
        if (recipeId) {
          await IngredientMapping.deleteMany({ recipeId });
        }
        
        // Creiamo le nuove associazioni
        const mappingsToSave = Object.entries(newMappings).map(([ingredientName, productId]) => ({
          ingredientName,
          productId,
          recipeId,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        const savedMappings = await IngredientMapping.insertMany(mappingsToSave);
        console.log(`Saved ${savedMappings.length} mappings for recipe ${recipeId}`);
        
        res.status(201).json(savedMappings);
        break;

      case 'DELETE':
        // Permette di eliminare tutte le associazioni di una ricetta
        const { recipeId: deleteRecipeId } = req.query;
        if (deleteRecipeId) {
          await IngredientMapping.deleteMany({ recipeId: deleteRecipeId });
          res.status(200).json({ message: 'Mappings deleted successfully' });
        } else {
          res.status(400).json({ error: 'Recipe ID is required' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}