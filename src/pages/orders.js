import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Save, ArrowLeft, EuroIcon, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { api } from '../lib/api';

export default function OrderManager() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentOrder, setCurrentOrder] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '07:00',
    description: '',
    waferText: '',
    waferDesign: '',
    notes: '',
    customerName: '',
    customerContact: '',
    deposit: '',
    allergies: '',
    hasAllergies: false,
    savoryItems: [{ item: '', quantity: '' }],
    printed: false
  });

  useEffect(() => {
    if (id) {
      const loadOrder = async () => {
        try {
          setIsLoading(true);
          const order = await api.getOrders();
          const foundOrder = order.find(o => o._id === id);
          if (foundOrder) {
            setCurrentOrder({
              ...foundOrder,
              allergies: foundOrder.allergies || '',
              hasAllergies: Boolean(foundOrder.allergies),
              savoryItems: foundOrder.savoryItems || [{ item: '', quantity: '' }]
            });
          }
        } catch (err) {
          setError('Errore nel caricamento dell\'ordine');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadOrder();
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      if (id) {
        await api.updateOrder(id, currentOrder);
      } else {
        const newOrder = {
          ...currentOrder,
          printed: false
        };
        await api.createOrder(newOrder);
      }
      router.push('/agenda');
    } catch (err) {
      setError('Errore nel salvataggio dell\'ordine');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCurrentOrder({...currentOrder, deposit: value});
    }
  };

  // Loading state check
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="text-2xl font-bold text-[#8B4513]">Caricamento...</div>
        </div>
      </Layout>
    );
  }
  const addSavoryItem = () => {
    setCurrentOrder({
      ...currentOrder,
      savoryItems: [...currentOrder.savoryItems, { item: '', quantity: '' }]
    });
  };

  const removeSavoryItem = (index) => {
    if (currentOrder.savoryItems.length > 1) {
      const newSavoryItems = currentOrder.savoryItems.filter((_, i) => i !== index);
      setCurrentOrder({
        ...currentOrder,
        savoryItems: newSavoryItems
      });
    }
  };

  const updateSavoryItem = (index, field, value) => {
    const newSavoryItems = currentOrder.savoryItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setCurrentOrder({
      ...currentOrder,
      savoryItems: newSavoryItems
    });
  };

  // Render methods for savory items section
  const renderSavoryItems = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Prodotti Salati</label>
        <button
          type="button"
          onClick={addSavoryItem}
          className="flex items-center gap-1 text-[#8B4513] hover:text-[#A0522D]"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </button>
      </div>
      
      <div className="space-y-2">
        {currentOrder.savoryItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={item.item}
                onChange={(e) => updateSavoryItem(index, 'item', e.target.value)}
                placeholder="Articolo"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
              />
            </div>
            <div className="w-24">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateSavoryItem(index, 'quantity', e.target.value)}
                placeholder="Qtà"
                min="1"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
              />
            </div>
            {currentOrder.savoryItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeSavoryItem(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D]">
            <ArrowLeft className="h-5 w-5" />
            Torna alla Home
          </Link>
          <Link href="/agenda" className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]">
            Agenda Ordini
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            {id ? 'Modifica Ordine' : 'Nuovo Ordine'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            {/* Sezione Data e Ora */}
            <FormDateTimeSection currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            {/* Sezione Descrizione */}
            <FormDescriptionSection currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            {/* Sezione Cialda */}
            <FormWaferSection currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            {/* Sezione Note */}
            <FormNotesSection currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            {/* Sezione Allergie */}
            <FormAllergiesSection currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            {/* Sezione Prodotti Salati */}
            {renderSavoryItems()}

            {/* Sezione Cliente e Acconto */}
            <FormCustomerSection 
              currentOrder={currentOrder} 
              setCurrentOrder={setCurrentOrder}
              handleDepositChange={handleDepositChange}
            />

            {/* Pulsanti di azione */}
            <FormActionButtons id={id} isLoading={isLoading} />
          </form>
        </div>
      </div>
    </Layout>
  );
}

// Component Section Definitions
const FormDateTimeSection = ({ currentOrder, setCurrentOrder }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* ... DateTimePicker implementation ... */}
  </div>
);

const FormDescriptionSection = ({ currentOrder, setCurrentOrder }) => (
  <div className="mb-4">
    {/* ... Description textarea implementation ... */}
  </div>
);

const FormWaferSection = ({ currentOrder, setCurrentOrder }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* ... Wafer text and design implementation ... */}
  </div>
);

const FormNotesSection = ({ currentOrder, setCurrentOrder }) => (
  <div className="mb-4">
    {/* ... Notes textarea implementation ... */}
  </div>
);

const FormAllergiesSection = ({ currentOrder, setCurrentOrder }) => (
  <div className="mb-4">
    {/* ... Allergies checkbox and textarea implementation ... */}
  </div>
);

const FormCustomerSection = ({ currentOrder, setCurrentOrder, handleDepositChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {/* ... Customer info and deposit implementation ... */}
  </div>
);

const FormActionButtons = ({ id, isLoading }) => (
  <div className="flex justify-end gap-2">
    <Link href="/agenda" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
      Annulla
    </Link>
    <button
      type="submit"
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] disabled:opacity-50"
    >
      <Save className="h-5 w-5" />
      {isLoading ? 'Salvataggio...' : (id ? 'Aggiorna' : 'Salva')}
    </button>
  </div>
);