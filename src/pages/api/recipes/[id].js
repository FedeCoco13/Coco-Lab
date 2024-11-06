import { connectToDatabase } from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera una ricetta specifica
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
        break;

      case 'PUT':
        // Aggiorna una ricetta
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedRecipe) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(updatedRecipe);
        break;

      case 'DELETE':
        // Elimina una ricetta
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}