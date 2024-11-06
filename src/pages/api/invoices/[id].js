import { connectToDatabase } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        // Recupera una fattura specifica
        const invoice = await Invoice.findById(id);
        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(invoice);
        break;

      case 'PUT':
        // Aggiorna una fattura
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(updatedInvoice);
        break;

      case 'DELETE':
        // Elimina una fattura
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}