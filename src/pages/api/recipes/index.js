import { connectToDatabase } from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera tutte le ricette
        const recipes = await Recipe.find({}).sort({ name: 1 });
        res.status(200).json(recipes);
        break;

      case 'POST':
        // Crea una nuova ricetta
        const recipe = await Recipe.create(req.body);
        res.status(201).json(recipe);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}