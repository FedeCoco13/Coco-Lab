import React, { useState, useEffect } from 'react';
import { Upload, ArrowLeft, Search, Trash, Printer, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const suppliers = ['CEDIAL', 'DOLCIFORNITURE', 'EUROVO', 'NOVASERVICE', 'PENTACARTA', 'PREGEL'];

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices');
    const storedProducts = localStorage.getItem('products');
    if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    if (storedProducts) {
      const productsData = JSON.parse(storedProducts);
      // Assicuriamo che ogni prodotto abbia un ID
      const productsWithIds = productsData.map(product => ({
        ...product,
        id: product.id || `${product.supplier}-${product.name}`.replace(/\s+/g, '-').toLowerCase()
      }));
      setProducts(productsWithIds);
    }
  }, []);

  const clearAllData = () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.')) {
      localStorage.removeItem('invoices');
      localStorage.removeItem('products');
      setInvoices([]);
      setProducts([]);
    }
  };

  const deleteProduct = (productToDelete) => {
    if (window.confirm(`Sei sicuro di voler eliminare il prodotto "${productToDelete.name}"?`)) {
      const updatedProducts = products.filter(product => product.id !== productToDelete.id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };
  const identifySupplier = (xmlDoc) => {
    const denominazione = xmlDoc.querySelector("CedentePrestatore DatiAnagrafici Anagrafica Denominazione");
    const partitaIva = xmlDoc.querySelector("CedentePrestatore DatiAnagrafici IdFiscaleIVA IdCodice");
    
    if (!denominazione) return '';
    
    const name = denominazione.textContent.toUpperCase();
    const piva = partitaIva?.textContent;

    if (name.includes('CE.DI.AL.')) return 'CEDIAL';
    if (name.includes('NOVASERVICE')) return 'NOVASERVICE';
    if (name.includes('DOLCI FORNITURE')) return 'DOLCIFORNITURE';
    if (name.includes('EUROVO')) return 'EUROVO';
    if (name.includes('PENTA CARTA')) return 'PENTACARTA';
    if (name.includes('PREGEL')) return 'PREGEL';
    
    switch (piva) {
      case '01054061005': return 'CEDIAL';
      case '04407491002': return 'NOVASERVICE';
      case '05194771001': return 'DOLCIFORNITURE';
      case '00727070393': return 'EUROVO';
      case '05913941000': return 'PENTACARTA';
      case '01851810362': return 'PREGEL';
      default: return '';
    }
  };

  const isValidProduct = (linea) => {
    const descrizione = linea.querySelector("Descrizione")?.textContent || '';
    
    const excludeTexts = [
      "Ordine Cl. num.",
      "Preord. Cl. num.",
      "Contributo",
      "CONTRIBUTO",
      "Aggiunta",
      "conai",
      "CONAI"
    ];
    
    return !excludeTexts.some(text => descrizione.toLowerCase().includes(text.toLowerCase()));
  };
  const parseXML = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    
    const dateNode = xmlDoc.querySelector("DatiGeneraliDocumento Data");
    const invoiceDate = dateNode ? dateNode.textContent : '';
    
    const supplier = identifySupplier(xmlDoc);
    const products = [];
    
    const dettaglioLinee = xmlDoc.querySelectorAll("DettaglioLinee");
    dettaglioLinee.forEach(linea => {
      if (!linea.querySelector("PrezzoUnitario") || !isValidProduct(linea)) return;

      const descrizione = linea.querySelector("Descrizione")?.textContent || '';
      const quantita = parseFloat(linea.querySelector("Quantita")?.textContent || '0');
      const prezzoUnitario = parseFloat(linea.querySelector("PrezzoUnitario")?.textContent || '0');
      const unitaMisura = linea.querySelector("UnitaMisura")?.textContent || '';
      const aliquotaIVA = linea.querySelector("AliquotaIVA")?.textContent || '0';
      
      const sconti = [];
      linea.querySelectorAll("ScontoMaggiorazione").forEach(sconto => {
        if (sconto.querySelector("Tipo")?.textContent === 'SC') {
          const percentuale = parseFloat(sconto.querySelector("Percentuale")?.textContent || '0');
          sconti.push(percentuale);
        }
      });

      products.push({
        id: `${supplier}-${descrizione}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: descrizione,
        quantity: quantita,
        price: prezzoUnitario,
        unit: unitaMisura,
        discounts: sconti,
        date: invoiceDate,
        supplier: supplier,
        iva: parseFloat(aliquotaIVA).toFixed(0)
      });
    });

    return { date: invoiceDate, supplier, products };
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    let allNewProducts = [];
    let newInvoices = [];
    
    try {
      for (const file of files) {
        const text = await file.text();
        const { date, supplier, products: fileProducts } = parseXML(text);
        allNewProducts = [...allNewProducts, ...fileProducts];

        newInvoices.push({
          id: Date.now() + Math.random(),
          date,
          file: text,
          supplier,
          fileName: file.name
        });
      }

      const updatedInvoices = [...invoices, ...newInvoices];
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

      const updatedProducts = [...products];
      
      allNewProducts.forEach(newProduct => {
        const existingProductIndex = updatedProducts.findIndex(p => p.id === newProduct.id);
        
        if (existingProductIndex !== -1) {
          const existingProduct = updatedProducts[existingProductIndex];
          if (!existingProduct.priceHistory) {
            existingProduct.priceHistory = [];
          }
          
          const priceExists = existingProduct.priceHistory.some(
            ph => ph.date === newProduct.date
          );
          
          if (!priceExists) {
            existingProduct.priceHistory.push({
              date: newProduct.date,
              price: newProduct.price,
              quantity: newProduct.quantity,
              discounts: newProduct.discounts
            });
            
            existingProduct.priceHistory.sort((a, b) => 
              new Date(b.date) - new Date(a.date)
            );

            if (!existingProduct.iva && newProduct.iva) {
              existingProduct.iva = newProduct.iva;
            }
          }
        } else {
          updatedProducts.push({
            ...newProduct,
            priceHistory: [{
              date: newProduct.date,
              price: newProduct.price,
              quantity: newProduct.quantity,
              discounts: newProduct.discounts
            }]
          });
        }
      });
      
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
    } catch (error) {
      console.error('Errore nel caricamento dei file:', error);
      alert('Si è verificato un errore nel caricamento di alcuni file');
    }
  };
  const getSupplierInvoiceDates = (supplierProducts) => {
    const allDates = new Set();
    supplierProducts.forEach(product => {
      product.priceHistory?.forEach(history => {
        allDates.add(history.date);
      });
    });
    return Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));
  };

  const getProductPriceForDate = (product, date) => {
    const priceRecord = product.priceHistory?.find(history => history.date === date);
    return priceRecord || null;
  };

  const handleScroll = (direction) => {
    const container = document.querySelector('.table-container');
    const scrollAmount = 200;
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollPosition(container.scrollLeft);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier;
    return matchesSearch && matchesSupplier;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const currentSupplierProducts = selectedSupplier 
    ? filteredProducts.filter(p => p.supplier === selectedSupplier)
    : [];
  const supplierDates = selectedSupplier 
    ? getSupplierInvoiceDates(currentSupplierProducts)
    : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D]"
          >
            <ArrowLeft className="h-5 w-5" />
            Torna alla Home
          </Link>
          <div className="flex gap-2">
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash className="h-5 w-5" />
              Cancella Tutto
            </button>
            <label className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] cursor-pointer">
              <input
                type="file"
                accept=".xml"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="h-5 w-5 inline-block mr-2" />
              Carica Fatture
            </label>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cerca prodotto..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-48 p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
            >
              <option value="">Seleziona fornitore</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedSupplier ? (
          <div>
            <div className="flex justify-end gap-2 mb-2">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 bg-white rounded-lg shadow text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 bg-white rounded-lg shadow text-gray-600 hover:text-gray-800"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="table-container overflow-auto max-h-[calc(100vh-250px)]">
                <table className="w-full text-left">
                  <thead className="bg-[#8B4513] text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium sticky left-0 bg-[#8B4513] z-20 whitespace-nowrap">
                        Prodotto
                      </th>
                      <th className="px-4 py-3 font-medium sticky left-[250px] bg-[#8B4513] z-20 whitespace-nowrap text-center">
                        IVA %
                      </th>
                      {supplierDates.map((date) => (
                        <th key={date} className="px-4 py-3 font-medium min-w-[200px] text-center whitespace-nowrap">
                          {new Date(date).toLocaleDateString('it-IT')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {currentSupplierProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-amber-50">
                        <td className="px-4 py-3 font-medium sticky left-0 bg-white border-r whitespace-nowrap">
                          <div className="flex justify-between items-center">
                            <span>{product.name}</span>
                            <button
                              onClick={() => deleteProduct(product)}
                              className="ml-2 text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center sticky left-[250px] bg-white border-r">
                          {product.iva}%
                        </td>
                        {supplierDates.map((date) => {
                          const priceRecord = getProductPriceForDate(product, date);
                          return (
                            <td key={date} className="px-4 py-3 text-center border-r">
                              {priceRecord && (
                                <>
                                  <div>Q: {priceRecord.quantity}</div>
                                  <div>P: €{priceRecord.price.toFixed(2)}</div>
                                  {priceRecord.discounts && priceRecord.discounts.length > 0 && (
                                    <div>S: {priceRecord.discounts.join(', ')}%</div>
                                  )}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Seleziona un fornitore per visualizzare i prodotti
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceManager;