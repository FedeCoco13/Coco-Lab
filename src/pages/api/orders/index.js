import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera tutti gli ordini
        const orders = await Order.find({}).sort({ date: -1 });
        res.status(200).json(orders);
        break;

      case 'POST':
        // Crea un nuovo ordine
        const order = await Order.create(req.body);
        res.status(201).json(order);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}