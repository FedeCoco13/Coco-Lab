import { connectToDatabase } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
      id,
      { printed: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating print status' });
  }
}