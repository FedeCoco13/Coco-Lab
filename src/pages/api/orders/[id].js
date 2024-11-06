import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera un ordine specifico
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
        break;

      case 'PUT':
        // Aggiorna un ordine
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
        break;

      case 'DELETE':
        // Elimina un ordine
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}