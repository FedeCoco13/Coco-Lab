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

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { printed: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Ordine non trovato' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dello stato di stampa' });
  }
}