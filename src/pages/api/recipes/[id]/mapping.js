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
        res.status(200).json(recipe.ingredientMappings || {});
        break;

      case 'POST':
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          { $set: { ingredientMappings: req.body.mappings } },
          { new: true, runValidators: true }
        );
        if (!updatedRecipe) {
          return res.status(404).json({ error: 'Ricetta non trovata' });
        }
        res.status(200).json(updatedRecipe.ingredientMappings || {});
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