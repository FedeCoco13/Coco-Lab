import React from 'react';
import { ArrowLeft, Calendar, Clock, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import Layout from '../components/Layout';

export default function OrderManager() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentOrder, setCurrentOrder] = React.useState({
    id: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '07:00',
    description: '',
    waferText: '',
    waferDesign: '',
    notes: '',
    customerName: '',
    customerContact: '',
    deposit: ''
  });
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const editingOrder = localStorage.getItem('editingOrder');
    if (editingOrder) {
      const parsedOrder = JSON.parse(editingOrder);
      setCurrentOrder({
        ...parsedOrder,
        deposit: parsedOrder.deposit || ''
      });
      setIsEditing(true);
      localStorage.removeItem('editingOrder');
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const formattedOrder = {
      ...currentOrder,
      deposit: currentOrder.deposit ? parseFloat(currentOrder.deposit).toFixed(2) : ''
    };
    
    if (isEditing) {
      const updatedOrders = existingOrders.map(order => 
        order.id === currentOrder.id ? formattedOrder : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } else {
      const newOrder = {
        ...formattedOrder,
        id: Date.now()
      };
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    }
    
    router.push('/agenda');
  };

  const handleDepositChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCurrentOrder({...currentOrder, deposit: value});
    }
  };
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
          <Link
            href="/agenda"
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]"
          >
            Agenda Ordini
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            {isEditing ? 'Modifica Ordine' : 'Nuovo Ordine'}
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={currentOrder.date}
                    onChange={(e) => setCurrentOrder({...currentOrder, date: e.target.value})}
                    className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ora
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={currentOrder.time.split(':')[0]}
                      onChange={(e) => {
                        const minutes = currentOrder.time.split(':')[1];
                        setCurrentOrder({
                          ...currentOrder,
                          time: `${e.target.value}:${minutes}`
                        });
                      }}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] appearance-none"
                      required
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 7).map(hour => (
                        <option key={hour} value={hour.toString().padStart(2, '0')}>
                          {hour.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500">:</span>
                  <div className="relative flex-1">
                    <select
                      value={currentOrder.time.split(':')[1]}
                      onChange={(e) => {
                        const hours = currentOrder.time.split(':')[0];
                        setCurrentOrder({
                          ...currentOrder,
                          time: `${hours}:${e.target.value}`
                        });
                      }}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] appearance-none"
                      required
                    >
                      {Array.from({ length: 6 }, (_, i) => i * 10).map(minute => (
                        <option key={minute} value={minute.toString().padStart(2, '0')}>
                          {minute.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione Ordine
              </label>
              <textarea
                value={currentOrder.description}
                onChange={(e) => setCurrentOrder({...currentOrder, description: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] h-24"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scritta su Cialda
                </label>
                <input
                  type="text"
                  value={currentOrder.waferText}
                  onChange={(e) => setCurrentOrder({...currentOrder, waferText: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disegno su Cialda
                </label>
                <input
                  type="text"
                  value={currentOrder.waferDesign}
                  onChange={(e) => setCurrentOrder({...currentOrder, waferDesign: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={currentOrder.notes}
                onChange={(e) => setCurrentOrder({...currentOrder, notes: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Cliente
                </label>
                <input
                  type="text"
                  value={currentOrder.customerName}
                  onChange={(e) => setCurrentOrder({...currentOrder, customerName: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contatto Cliente
                </label>
                <input
                  type="text"
                  value={currentOrder.customerContact}
                  onChange={(e) => setCurrentOrder({...currentOrder, customerContact: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acconto €
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                  <input
                    type="text"
                    value={currentOrder.deposit}
                    onChange={handleDepositChange}
                    placeholder="0.00"
                    className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href="/agenda"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annulla
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]"
              >
                <Save className="h-5 w-5" />
                {isEditing ? 'Aggiorna' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}