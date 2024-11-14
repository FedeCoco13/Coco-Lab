import React, { useState, useEffect, useRef } from 'react';
import { Upload, ArrowLeft, Search, Trash, Printer, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { toast } from 'sonner';

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableRef = useRef(null);

  const suppliers = ['CEDIAL', 'DOLCIFORNITURE', 'EUROVO', 'NOVASERVICE', 'PENTACARTA', 'PREGEL'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const invoicesData = await api.getInvoices();
      setInvoices(invoicesData);
      
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const productsData = JSON.parse(storedProducts);
        const productsWithIds = productsData.map(product => ({
          ...product,
          id: product.id || `${product.supplier}-${product.name}`.replace(/\s+/g, '-').toLowerCase()
        }));
        setProducts(productsWithIds);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      toast.error('Errore nel caricamento dei dati');
    }
  };
  // Funzioni di gestione scroll e touch
  const handleScroll = (direction) => {
    if (tableRef.current) {
      const scrollAmount = 200;
      const currentScroll = tableRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? 
        currentScroll - scrollAmount : 
        currentScroll + scrollAmount;

      tableRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      setScrollPosition(targetScroll);
    }
  };

  const handleTouchScroll = (e) => {
    if (!tableRef.current) return;
    
    const touchDelta = e.touches[0].clientX - startTouchRef.current;
    const sensitivity = 1.5; // Aumenta o diminuisci per modificare la sensibilità dello scroll
    
    tableRef.current.scrollLeft = scrollStartRef.current - (touchDelta * sensitivity);
  };

  const startTouchRef = useRef(0);
  const scrollStartRef = useRef(0);

  const handleTouchStart = (e) => {
    if (!tableRef.current) return;
    
    startTouchRef.current = e.touches[0].clientX;
    scrollStartRef.current = tableRef.current.scrollLeft;
    
    tableRef.current.addEventListener('touchmove', handleTouchScroll);
  };

  const handleTouchEnd = () => {
    if (!tableRef.current) return;
    tableRef.current.removeEventListener('touchmove', handleTouchScroll);
  };
  const clearAllData = async () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.')) {
      try {
        const allInvoices = await api.getInvoices();
        for (const invoice of allInvoices) {
          await api.deleteInvoice(invoice._id);
        }
        localStorage.removeItem('products');
        setInvoices([]);
        setProducts([]);
        toast.success('Tutti i dati sono stati eliminati');
      } catch (error) {
        console.error('Errore nell\'eliminazione dei dati:', error);
        toast.error('Errore nell\'eliminazione dei dati');
      }
    }
  };

  const deleteProduct = (productToDelete) => {
    if (window.confirm(`Sei sicuro di voler eliminare il prodotto "${productToDelete.name}"?`)) {
      const updatedProducts = products.filter(product => product.id !== productToDelete.id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast.success('Prodotto eliminato con successo');
    }
  };

  const identifySupplier = (xmlDoc) => {
    const denominazione = xmlDoc.querySelector("CedentePrestatore DatiAnagrafici Anagrafica Denominazione");
    const partitaIva = xmlDoc.querySelector("CedentePrestatore DatiAnagrafici IdFiscaleIVA IdCodice");
    
    if (!denominazione) return '';
    
    const name = denominazione.textContent.toUpperCase();
    const piva = partitaIva?.textContent;

    // ... resto del codice per l'identificazione del fornitore ...
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
    try {
      for (const file of files) {
        const text = await file.text();
        const { date, supplier, products: fileProducts } = parseXML(text);

        await api.createInvoice({
          date,
          supplier,
          fileName: file.name,
          file: text,
          products: fileProducts
        });

        updateProducts(fileProducts);
      }
      
      await loadData();
      toast.success('Fatture caricate con successo');
    } catch (error) {
      console.error('Errore nel caricamento dei file:', error);
      toast.error('Si è verificato un errore nel caricamento dei file');
    }
  };

  const updateProducts = (newProducts) => {
    const updatedProducts = [...products];
    
    newProducts.forEach(newProduct => {
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
            <div className="flex flex-col md:flex-row gap-4">
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
                className="w-full md:w-48 p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
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
                className="p-2 bg-white rounded-lg shadow text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 bg-white rounded-lg shadow text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div 
                ref={tableRef}
                className="overflow-x-auto w-full touch-pan-x"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full">
                    <thead className="bg-[#8B4513] text-white">
                      <tr>
                        <th className="sticky left-0 z-20 bg-[#8B4513] p-4 text-left font-medium whitespace-nowrap min-w-[200px]">
                          Prodotto
                        </th>
                        <th className="sticky left-[200px] z-20 bg-[#8B4513] p-4 text-center font-medium whitespace-nowrap min-w-[100px]">
                          IVA %
                        </th>
                        {supplierDates.map((date) => (
                          <th key={date} className="p-4 text-center font-medium whitespace-nowrap min-w-[150px]">
                            {new Date(date).toLocaleDateString('it-IT')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentSupplierProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-amber-50">
                          <td className="sticky left-0 bg-white border-r p-4 text-sm whitespace-nowrap">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{product.name}</span>
                              <button
                                onClick={() => deleteProduct(product)}
                                className="ml-2 text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="sticky left-[200px] bg-white border-r p-4 text-center text-sm">
                            {product.iva}%
                          </td>
                          {supplierDates.map((date) => {
                            const priceRecord = getProductPriceForDate(product, date);
                            return (
                              <td key={date} className="p-4 text-center text-sm border-r">
                                {priceRecord && (
                                  <div className="space-y-1">
                                    <div>Q: {priceRecord.quantity}</div>
                                    <div>P: €{priceRecord.price.toFixed(2)}</div>
                                    {priceRecord.discounts && priceRecord.discounts.length > 0 && (
                                      <div>S: {priceRecord.discounts.join(', ')}%</div>
                                    )}
                                  </div>
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
