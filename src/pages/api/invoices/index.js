import { connectToDatabase } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        // Recupera tutte le fatture ordinate per data
        const invoices = await Invoice.find({})
          .sort({ date: -1 })
          .lean();
        res.status(200).json(invoices);
        break;

      case 'POST':
        // Crea una nuova fattura con i prodotti
        const newInvoice = await Invoice.create({
          date: req.body.date,
          supplier: req.body.supplier,
          fileName: req.body.fileName,
          file: req.body.file,
          products: req.body.products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            unit: product.unit,
            supplier: product.supplier,
            iva: product.iva,
            discounts: product.discounts,
            date: req.body.date
          }))
        });
        res.status(201).json(newInvoice);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}