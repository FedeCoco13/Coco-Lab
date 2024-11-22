import React, { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval, startOfDay, isBefore } from 'date-fns';
import { it } from 'date-fns/locale';
import { Edit, Printer, MessageCircle, Trash, ArrowLeft, Search, Archive } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { toast } from 'sonner';

function OrderAgenda() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showArchivedOrders, setShowArchivedOrders] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        setError('Errore nel caricamento degli ordini');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filterOrders = () => {
    const today = startOfDay(new Date());
    
    const activeOrders = orders.filter(order => {
      const orderDate = parseISO(order.date);
      return !isBefore(orderDate, today);
    });

    const archivedOrders = orders.filter(order => {
      const orderDate = parseISO(order.date);
      return isBefore(orderDate, today);
    });

    return { activeOrders, archivedOrders };
  };

  const getFilteredOrders = () => {
    const { activeOrders, archivedOrders } = filterOrders();
    const ordersToShow = showArchivedOrders ? archivedOrders : activeOrders;

    return ordersToShow.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.description?.toLowerCase().includes(searchLower) ||
        order.waferText?.toLowerCase().includes(searchLower) ||
        format(parseISO(order.date), 'd MMMM yyyy', { locale: it }).toLowerCase().includes(searchLower)
      );
    });
  };
  const deleteOrder = async (orderId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo ordine?')) {
      try {
        await api.deleteOrder(orderId);
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success('Ordine eliminato con successo');
      } catch (err) {
        setError('Errore nell\'eliminazione dell\'ordine');
        console.error(err);
        toast.error('Errore nell\'eliminazione dell\'ordine');
      }
    }
  };

  const editOrder = (order) => {
    router.push(`/orders?id=${order._id}`);
  };
  const sendWhatsApp = (order) => {
    const details = [];
    // Aggiunta intestazione
    details.push(`🍰 COCO - PASTICCERIA 🍰`);
    details.push(`👤 ${order.customerName} - ${order.customerContact}`);
    details.push(`\n📅 Data: ${format(parseISO(order.date), 'd MMMM yyyy', { locale: it })}`);
    details.push(`⏰ Ora: ${order.time}`);
    
    if (order.hasAllergies) {
      details.push(`\n⚠️ ALLERGIE:\n${order.allergies}`);
    }

    if (order.description) details.push(`\n📝 Descrizione:\n${order.description}`);
    if (order.waferText) details.push(`\n✍️ Scritta:\n${order.waferText}`);
    if (order.waferDesign) details.push(`\n🎨 Disegno:\n${order.waferDesign}`);
    
    if (order.savoryItems?.length > 0) {
      details.push('\n🥪 Prodotti Salati:');
      order.savoryItems.forEach(item => {
        details.push(`- ${item.item}: ${item.quantity}`);
      });
    }

    if (order.notes) details.push(`\n📌 Note:\n${order.notes}`);
    if (order.deposit) details.push(`\n💰 Acconto: €${parseFloat(order.deposit).toFixed(2)}`);

    const message = details.join('\n').trim();

    window.open(
      `https://web.whatsapp.com/send?phone=${order.customerContact.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };
  const printOrder = async (order) => {
    const details = [];
    // Header con dati principali
    details.push(`Data: ${format(parseISO(order.date), 'd MMMM yyyy', { locale: it })}`);
    details.push(`Ora: ${order.time}`);
    details.push(`Cliente: ${order.customerName}`);
    if (order.customerContact) details.push(`Contatto: ${order.customerContact}`);
    
    // Allergie in cima se presenti
    if (order.hasAllergies) {
      details.push(`\n⚠️ ALLERGIE/INTOLLERANZE ⚠️\n${order.allergies.toUpperCase()}`);
    }

    if (order.description) details.push(`\nDescrizione:\n${order.description}`);
    if (order.waferText) details.push(`\nScritta:\n${order.waferText}`);
    if (order.waferDesign) details.push(`\nDisegno:\n${order.waferDesign}`);
    
    if (order.savoryItems?.length > 0) {
      details.push('\nProdotti Salati:');
      order.savoryItems.forEach(item => {
        details.push(`${item.item}: ${item.quantity}`);
      });
    }

    if (order.notes) details.push(`\nNote:\n${order.notes}`);
    if (order.deposit) details.push(`\nAcconto: €${parseFloat(order.deposit).toFixed(2)}`);

    const printContent = `
      <html>
        <head>
          <style>
            @page {
              margin: 2mm;
              size: 80mm auto;
            }
            body {
              font-family: Arial;
              font-size: 16px;
              margin: 0;
              padding: 4mm;
              width: 72mm;
              white-space: pre-wrap;
            }
            .header {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 3mm;
            }
            .allergies {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              background-color: #ffe0e0;
              padding: 2mm;
              margin: 2mm 0;
              border: 1px solid #ff0000;
            }
            .section {
              margin: 2mm 0;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${details.join('\n')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    try {
      await api.markOrderAsPrinted(order._id);
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o._id === order._id ? {...o, printed: true} : o
        )
      );
      toast.success('Ordine stampato e contrassegnato');
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato di stampa:', error);
      toast.error('Errore nell\'aggiornamento dello stato di stampa');
    }
  };
  const printMultipleOrders = () => {
    const start = parseISO(dateRange.startDate);
    const end = parseISO(dateRange.endDate);

    const ordersInRange = orders.filter(order => {
      const orderDate = parseISO(order.date);
      return isWithinInterval(orderDate, { start, end });
    }).sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA - dateB;
    });

    const printContent = `
      <html>
        <head>
          <style>
            @page {
              margin: 2mm;
              size: 80mm auto;
            }
            body {
              font-family: Arial;
              font-size: 16px;
              margin: 0;
              padding: 4mm;
              width: 72mm;
            }
            .date-range {
              text-align: center;
              margin-bottom: 4mm;
              font-weight: bold;
              font-size: 18px;
            }
            .order {
              border-bottom: 1px dashed #000;
              padding-bottom: 4mm;
              margin-bottom: 4mm;
            }
            .order:last-child {
              border-bottom: none;
            }
            .allergies {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              background-color: #ffe0e0;
              padding: 2mm;
              margin: 2mm 0;
              border: 1px solid #ff0000;
            }
          </style>
        </head>
        <body>
          <div class="date-range">
            Dal ${format(start, 'd MMMM yyyy', { locale: it })} 
            al ${format(end, 'd MMMM yyyy', { locale: it })}
          </div>
          ${ordersInRange.map(order => {
            const details = [];
            details.push(`Data: ${format(parseISO(order.date), 'd MMMM yyyy', { locale: it })}`);
            details.push(`Ora: ${order.time}`);
            details.push(`Cliente: ${order.customerName}`);
            if (order.customerContact) details.push(`Contatto: ${order.customerContact}`);
            
            // Allergie in evidenza
            if (order.hasAllergies) {
              details.push(`<div class="allergies">ALLERGIE: ${order.allergies}</div>`);
            }

            if (order.description) details.push(`Descrizione: ${order.description}`);
            if (order.waferText) details.push(`Scritta: ${order.waferText}`);
            if (order.waferDesign) details.push(`Disegno: ${order.waferDesign}`);
            
            if (order.savoryItems?.length > 0) {
              details.push('Prodotti Salati:');
              order.savoryItems.forEach(item => {
                details.push(`- ${item.item}: ${item.quantity}`);
              });
            }

            if (order.notes) details.push(`Note: ${order.notes}`);
            if (order.deposit) details.push(`Acconto: €${parseFloat(order.deposit).toFixed(2)}`);

            return `<div class="order">${details.join('<br>')}</div>`;
          }).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    setShowPrintModal(false);
  };
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="text-xl text-[#8B4513]">Caricamento ordini...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header responsive */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D] w-full md:w-auto justify-center md:justify-start"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Torna alla Home</span>
          </Link>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center"
            >
              <Printer className="h-5 w-5" />
              <span>Stampa Lista</span>
            </button>
            <button
              onClick={() => setShowArchivedOrders(!showArchivedOrders)}
              className={`px-4 py-2 ${
                showArchivedOrders 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white rounded-lg flex items-center gap-2 justify-center`}
            >
              <Archive className="h-5 w-5" />
              <span>{showArchivedOrders ? 'Ordini Attivi' : 'Archivio'}</span>
            </button>
            <Link
              href="/orders"
              className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] text-center flex items-center justify-center"
            >
              Nuovo Ordine
            </Link>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#8B4513] mb-6 text-center md:text-left">
          {showArchivedOrders ? 'Archivio Ordini' : 'Agenda Ordini'}
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Barra di ricerca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cerca per nome cliente, descrizione, data..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Stampa */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-[#8B4513] mb-4">Stampa Lista Ordini</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Inizio
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Fine
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full md:w-auto"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={printMultipleOrders}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center w-full md:w-auto"
                  >
                    <Printer className="h-5 w-5" />
                    Stampa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Vista Mobile */}
        <div className="block md:hidden space-y-4">
          {getFilteredOrders()
            .sort((a, b) => {
              const dateA = new Date(a.date + 'T' + a.time);
              const dateB = new Date(b.date + 'T' + b.time);
              return dateA - dateB;
            })
            .map(order => (
              <div 
                key={order._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  (!order.printed || order.printed === false) ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-[#8B4513]">
                        {format(parseISO(order.date), 'd MMMM yyyy', { locale: it })}
                      </div>
                      <div className="text-sm text-gray-600">{order.time}</div>
                    </div>
                    {(!order.printed || order.printed === false) && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                        Da stampare
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-600">{order.customerContact}</div>
                    {order.deposit && (
                      <div className="text-sm text-green-600">
                        Acconto: €{parseFloat(order.deposit).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {order.hasAllergies && (
                      <div className="text-red-600 font-bold">
                        <span className="font-medium">ALLERGIE:</span> {order.allergies}
                      </div>
                    )}
                    {order.description && (
                      <div><span className="font-medium">Descrizione:</span> {order.description}</div>
                    )}
                    {order.waferText && (
                      <div><span className="font-medium">Scritta:</span> {order.waferText}</div>
                    )}
                    {order.waferDesign && (
                      <div><span className="font-medium">Disegno:</span> {order.waferDesign}</div>
                    )}
                    {order.savoryItems && order.savoryItems.length > 0 && (
                      <div>
                        <span className="font-medium">Prodotti Salati:</span>
                        <ul className="list-disc list-inside pl-2">
                          {order.savoryItems.map((item, idx) => (
                            <li key={idx}>{item.item}: {item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {order.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Note:</span> {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t px-4 py-3 bg-gray-50 flex justify-end gap-2">
                  <button
                    onClick={() => printOrder(order)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                      (!order.printed || order.printed === false)
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Printer className="h-4 w-4" />
                    <span className="text-sm">Stampa</span>
                  </button>
                  <button
                    onClick={() => sendWhatsApp(order)}
                    className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => editOrder(order)}
                    className="flex items-center gap-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-sm">Modifica</span>
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="text-sm">Elimina</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* Vista Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#8B4513] text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">Data e Ora</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Dettagli Ordine</th>
                  <th className="px-4 py-3 font-medium text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredOrders()
                  .sort((a, b) => {
                    const dateA = new Date(a.date + 'T' + a.time);
                    const dateB = new Date(b.date + 'T' + b.time);
                    return dateA - dateB;
                  })
                  .map(order => (
                    <tr 
                      key={order._id} 
                      className={`hover:bg-amber-50 ${(!order.printed || order.printed === false) ? 'bg-yellow-100' : ''}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-[#8B4513]">
                          {format(parseISO(order.date), 'd MMMM yyyy', { locale: it })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.time}
                        </div>
                        {(!order.printed || order.printed === false) && (
                          <div className="text-xs text-red-600 font-medium">
                            Da stampare
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-600">{order.customerContact}</div>
                        {order.deposit && (
                          <div className="text-sm text-green-600">
                            Acconto: €{parseFloat(order.deposit).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {order.hasAllergies && (
                            <div className="text-red-600 font-bold">
                              <span className="font-medium">ALLERGIE:</span> {order.allergies}
                            </div>
                          )}
                          {order.description && (
                            <div><span className="font-medium">Descrizione:</span> {order.description}</div>
                          )}
                          {order.waferText && (
                            <div><span className="font-medium">Scritta:</span> {order.waferText}</div>
                          )}
                          {order.waferDesign && (
                            <div><span className="font-medium">Disegno:</span> {order.waferDesign}</div>
                          )}
                          {order.savoryItems && order.savoryItems.length > 0 && (
                            <div>
                              <span className="font-medium">Prodotti Salati:</span>
                              <ul className="list-disc list-inside pl-2">
                                {order.savoryItems.map((item, idx) => (
                                  <li key={idx}>{item.item}: {item.quantity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {order.notes && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Note:</span> {order.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => printOrder(order)}
                            className={`p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg ${
                              (!order.printed || order.printed === false) ? 'ring-2 ring-red-500 ring-offset-1' : ''
                            }`}
                            title={(!order.printed || order.printed === false) ? 'Da stampare!' : 'Stampa'}
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => sendWhatsApp(order)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => editOrder(order)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Modifica"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Elimina"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderAgenda;