import { connectToDatabase } from '../../../lib/mongodb';
import IngredientMapping from '../../../models/IngredientMapping';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        const mapping = await IngredientMapping.findById(id);
        if (!mapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json(mapping);
        break;

      case 'PUT':
        const updatedMapping = await IngredientMapping.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
        if (!updatedMapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json(updatedMapping);
        break;

      case 'DELETE':
        const deletedMapping = await IngredientMapping.findByIdAndDelete(id);
        if (!deletedMapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json({ message: 'Mapping deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}