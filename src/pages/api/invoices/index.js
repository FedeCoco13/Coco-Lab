import { connectToDatabase } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera tutte le fatture
        const invoices = await Invoice.find({}).sort({ date: -1 });
        res.status(200).json(invoices);
        break;

      case 'POST':
        // Crea una nuova fattura
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}