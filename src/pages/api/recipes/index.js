import { connectToDatabase } from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        const recipes = await Recipe.find({});
        res.status(200).json(recipes);
        break;

      case 'POST':
        const recipe = await Recipe.create(req.body);
        res.status(201).json(recipe);
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