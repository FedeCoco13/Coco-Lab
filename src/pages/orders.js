import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Save, ArrowLeft, EuroIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { toast } from 'sonner';

// Componente di debug
const DebugInfo = ({ currentOrder }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50">
      <pre>{JSON.stringify(currentOrder, null, 2)}</pre>
    </div>
  );
};

export default function OrderManager() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
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
    printed: false
  });

  // Handler semplificato per gli input
  const handleInputChange = (e, field) => {
    console.log('Input change:', { field, value: e.target.value });
    setInputValue(e.target.value);
    setCurrentOrder(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Handler per il deposito
  const handleDepositChange = (e) => {
    console.log('Deposit change:', e.target.value);
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCurrentOrder(prev => ({
        ...prev,
        deposit: value
      }));
    }
  };

  // Gestore del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitting...');
    setError('');
    setIsLoading(true);
  
    try {
      if (id) {
        await api.updateOrder(id, currentOrder);
        toast.success('Ordine aggiornato con successo');
      } else {
        const newOrder = {
          ...currentOrder,
          printed: false
        };
        await api.createOrder(newOrder);
        toast.success('Ordine creato con successo');
      }
      router.push('/agenda');
    } catch (err) {
      setError('Errore nel salvataggio dell\'ordine');
      console.error(err);
      toast.error('Errore nel salvataggio dell\'ordine');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const loadOrder = async () => {
        try {
          setIsLoading(true);
          const order = await api.getOrders();
          const foundOrder = order.find(o => o._id === id);
          if (foundOrder) {
            setCurrentOrder(foundOrder);
          }
        } catch (err) {
          setError('Errore nel caricamento dell\'ordine');
          console.error(err);
          toast.error('Errore nel caricamento dell\'ordine');
        } finally {
          setIsLoading(false);
        }
      };
      loadOrder();
    }
  }, [id]);
  // Componenti di utilità ottimizzati per mobile
  const TimeSelector = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mobile-input w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B4513] bg-white text-base"
      style={{
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        fontSize: '16px'
      }}
      required
    >
      {options.map(option => (
        <option key={option} value={option.toString().padStart(2, '0')}>
          {option.toString().padStart(2, '0')}
        </option>
      ))}
    </select>
  );

  const FormSection = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <h3 className="text-lg font-medium text-[#8B4513] mb-3">{title}</h3>
      {children}
    </div>
  );

  // Input mobile ottimizzato
  const MobileInput = ({ 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    required = false,
    className = "",
    inputMode = "text"
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      className={`mobile-input w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B4513] bg-white text-base ${className}`}
      style={{
        fontSize: '16px',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    />
  );

  // Mobile Textarea
  const MobileTextarea = ({ 
    value, 
    onChange, 
    placeholder, 
    required = false,
    className = "",
    rows = 4
  }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`mobile-input w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8B4513] bg-white text-base ${className}`}
      style={{
        fontSize: '16px',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    />
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
            <div className="text-xl font-bold text-[#8B4513]">Caricamento...</div>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Debug Info in Development */}
        <DebugInfo currentOrder={currentOrder} />
        
        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D] w-full md:w-auto justify-center md:justify-start"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Torna alla Home</span>
          </Link>
          <Link
            href="/agenda"
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] w-full md:w-auto text-center"
          >
            Agenda Ordini
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6 text-center md:text-left">
            {id ? 'Modifica Ordine' : 'Nuovo Ordine'}
          </h1>

          <form onSubmit={handleSubmit} className="mobile-form space-y-4 md:space-y-6">
            {/* Vista Mobile Ottimizzata */}
            <div className="block md:hidden">
              {/* Data e Ora - Mobile */}
              <FormSection title="Data e Ora">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data
                    </label>
                    <MobileInput
                      type="date"
                      value={currentOrder.date}
                      onChange={(e) => handleInputChange(e, 'date')}
                      required={true}
                      inputMode="none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ora
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <TimeSelector
                        value={currentOrder.time.split(':')[0]}
                        onChange={(value) => {
                          const minutes = currentOrder.time.split(':')[1];
                          handleInputChange(
                            { target: { value: `${value}:${minutes}` } },
                            'time'
                          );
                        }}
                        options={Array.from({ length: 13 }, (_, i) => i + 7)}
                      />
                      <TimeSelector
                        value={currentOrder.time.split(':')[1]}
                        onChange={(value) => {
                          const hours = currentOrder.time.split(':')[0];
                          handleInputChange(
                            { target: { value: `${hours}:${value}` } },
                            'time'
                          );
                        }}
                        options={Array.from({ length: 6 }, (_, i) => i * 10)}
                      />
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Descrizione - Mobile */}
              <FormSection title="Dettagli Ordine">
                <MobileTextarea
                  value={currentOrder.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  placeholder="Inserisci la descrizione dell'ordine"
                  required={true}
                  className="h-32"
                />
              </FormSection>

              {/* Cialda - Mobile */}
              <FormSection title="Dettagli Cialda">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scritta su Cialda
                    </label>
                    <MobileInput
                      value={currentOrder.waferText}
                      onChange={(e) => handleInputChange(e, 'waferText')}
                      placeholder="Inserisci il testo per la cialda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disegno su Cialda
                    </label>
                    <MobileInput
                      value={currentOrder.waferDesign}
                      onChange={(e) => handleInputChange(e, 'waferDesign')}
                      placeholder="Descrivi il disegno per la cialda"
                    />
                  </div>
                </div>
              </FormSection>

              {/* Note - Mobile */}
              <FormSection title="Note Aggiuntive">
                <MobileTextarea
                  value={currentOrder.notes}
                  onChange={(e) => handleInputChange(e, 'notes')}
                  placeholder="Inserisci eventuali note..."
                  className="h-24"
                />
              </FormSection>

              {/* Cliente - Mobile */}
              <FormSection title="Informazioni Cliente">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Cliente
                    </label>
                    <MobileInput
                      value={currentOrder.customerName}
                      onChange={(e) => handleInputChange(e, 'customerName')}
                      placeholder="Nome del cliente"
                      required={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contatto Cliente
                    </label>
                    <MobileInput
                      value={currentOrder.customerContact}
                      onChange={(e) => handleInputChange(e, 'customerContact')}
                      placeholder="Contatto del cliente"
                      required={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Acconto €
                    </label>
                    <div className="relative">
                      <EuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <MobileInput
                        value={currentOrder.deposit}
                        onChange={(e) => handleDepositChange(e)}
                        placeholder="0.00"
                        inputMode="decimal"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
            {/* Layout Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-lg p-6">
              {/* Data e Ora - Desktop */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={currentOrder.date}
                      onChange={(e) => handleInputChange(e, 'date')}
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
                      <TimeSelector
                        value={currentOrder.time.split(':')[0]}
                        onChange={(value) => {
                          const minutes = currentOrder.time.split(':')[1];
                          handleInputChange(
                            { target: { value: `${value}:${minutes}` } },
                            'time'
                          );
                        }}
                        options={Array.from({ length: 13 }, (_, i) => i + 7)}
                      />
                    </div>
                    <span className="text-gray-500">:</span>
                    <div className="relative flex-1">
                      <TimeSelector
                        value={currentOrder.time.split(':')[1]}
                        onChange={(value) => {
                          const hours = currentOrder.time.split(':')[0];
                          handleInputChange(
                            { target: { value: `${hours}:${value}` } },
                            'time'
                          );
                        }}
                        options={Array.from({ length: 6 }, (_, i) => i * 10)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrizione - Desktop */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione Ordine
                </label>
                <textarea
                  value={currentOrder.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] h-24"
                  required
                />
              </div>

              {/* Cialda - Desktop */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scritta su Cialda
                  </label>
                  <input
                    type="text"
                    value={currentOrder.waferText}
                    onChange={(e) => handleInputChange(e, 'waferText')}
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
                    onChange={(e) => handleInputChange(e, 'waferDesign')}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  />
                </div>
              </div>

              {/* Note - Desktop */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  value={currentOrder.notes}
                  onChange={(e) => handleInputChange(e, 'notes')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] h-20"
                />
              </div>

              {/* Cliente e Acconto - Desktop */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Cliente
                  </label>
                  <input
                    type="text"
                    value={currentOrder.customerName}
                    onChange={(e) => handleInputChange(e, 'customerName')}
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
                    onChange={(e) => handleInputChange(e, 'customerContact')}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                    required
                  />
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
                      onChange={(e) => handleDepositChange(e)}
                      placeholder="0.00"
                      className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Pulsanti di azione - Responsive */}
            <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
              <Link
                href="/agenda"
                className="w-full md:w-auto px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-center"
              >
                Annulla
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {isLoading ? 'Salvataggio...' : (id ? 'Aggiorna' : 'Salva')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}