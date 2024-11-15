import { connectToDatabase } from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    console.log('MongoDB connected successfully');

    switch (req.method) {
      case 'GET':
        const invoices = await Invoice.find({})
          .sort({ date: -1 })
          .lean();
        console.log(`Retrieved ${invoices.length} invoices`);
        res.status(200).json(invoices);
        break;

      case 'POST':
        console.log('Creating new invoice with data:', {
          date: req.body.date,
          supplier: req.body.supplier,
          fileName: req.body.fileName,
          productsCount: req.body.products?.length
        });

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
            date: product.date,
            priceHistory: [{
              date: product.date,
              price: product.price,
              quantity: product.quantity,
              discounts: product.discounts
            }]
          }))
        });

        console.log('Invoice created successfully with ID:', newInvoice._id);
        res.status(201).json(newInvoice);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}