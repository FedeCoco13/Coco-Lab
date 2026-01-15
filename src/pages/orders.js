import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Save, ArrowLeft, EuroIcon, Plus, Minus } from 'lucide-react';

export default function OrderManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentOrder, setCurrentOrder] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '07:00',
    description: '',
    waferText: '',
    waferDesign: '',
    notes: '',
    customerName: '',
    customerContact: '+39',
    deposit: '',
    allergies: '',
    hasAllergies: false,
    savoryItems: [{ item: '', quantity: '' }],
    printed: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulazione salvataggio
    setTimeout(() => {
      console.log('Ordine salvato:', currentOrder);
      setIsLoading(false);
      alert('Ordine salvato con successo!');
    }, 1000);
  };

  const handleDepositChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCurrentOrder({...currentOrder, deposit: value});
    }
  };

  const handleContactChange = (e) => {
    let value = e.target.value;
    
    // Se l'utente cerca di cancellare il +39, lo ripristiniamo
    if (!value.startsWith('+39')) {
      value = '+39';
    }
    
    // Permetti solo numeri dopo il +39
    const afterPrefix = value.slice(3);
    if (afterPrefix === '' || /^\d*$/.test(afterPrefix)) {
      setCurrentOrder({...currentOrder, customerContact: value});
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-amber-900">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center gap-2 text-amber-900 hover:text-amber-700">
            <ArrowLeft className="h-5 w-5" />
            Torna alla Home
          </button>
          <button className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800">
            Agenda Ordini
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-amber-900 mb-6">
            Nuovo Ordine
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            {/* Data e Ora */}
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
                    className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
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
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 appearance-none text-gray-900"
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
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 appearance-none text-gray-900"
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

            {/* Descrizione */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione Ordine
              </label>
              <textarea
                value={currentOrder.description}
                onChange={(e) => setCurrentOrder({...currentOrder, description: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 h-24 text-gray-900"
                required
              />
            </div>

            {/* Cialda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scritta su Cialda
                </label>
                <input
                  type="text"
                  value={currentOrder.waferText}
                  onChange={(e) => setCurrentOrder({...currentOrder, waferText: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
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
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
                />
              </div>
            </div>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={currentOrder.notes}
                onChange={(e) => setCurrentOrder({...currentOrder, notes: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 h-20 text-gray-900"
              />
            </div>

            {/* Allergie */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="hasAllergies"
                  checked={currentOrder.hasAllergies}
                  onChange={(e) => setCurrentOrder({
                    ...currentOrder,
                    hasAllergies: e.target.checked,
                    allergies: e.target.checked ? currentOrder.allergies : ''
                  })}
                  className="rounded border-gray-300 text-amber-900 focus:ring-amber-900"
                />
                <label htmlFor="hasAllergies" className="text-sm font-medium text-gray-700">
                  Presenza di Allergie/Intolleranze
                </label>
              </div>
              {currentOrder.hasAllergies && (
                <textarea
                  value={currentOrder.allergies}
                  onChange={(e) => setCurrentOrder({...currentOrder, allergies: e.target.value})}
                  placeholder="Descrivi le allergie/intolleranze..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 h-20 text-gray-900"
                />
              )}
            </div>

            {/* Prodotti Salati */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prodotti Salati
                </label>
                <button
                  type="button"
                  onClick={addSavoryItem}
                  className="flex items-center gap-1 text-amber-900 hover:text-amber-700"
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
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateSavoryItem(index, 'quantity', e.target.value)}
                        placeholder="Qtà"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
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

            {/* Cliente e Acconto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Cliente
                </label>
                <input
                  type="text"
                  value={currentOrder.customerName}
                  onChange={(e) => setCurrentOrder({...currentOrder, customerName: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Cliente
                </label>
                <input
                  type="text"
                  value={currentOrder.customerContact}
                  onChange={handleContactChange}
                  placeholder="+39 3XX XXXXXXX"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900 font-mono"
                  required
                  maxLength={13}
                />
                <p className="text-xs text-gray-500 mt-1">Inserisci solo le cifre dopo +39</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acconto €
                </label>
                <div className="relative">
                  <EuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={currentOrder.deposit}
                    onChange={handleDepositChange}
                    placeholder="0.00"
                    className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-amber-900 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Pulsanti */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {isLoading ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
