import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash, Printer, ArrowLeft, X, Save, Calculator, Eye, Minus, DollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { toast } from 'sonner';

const RecipeManager = () => {
  // Stati base
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [showRecalculateModal, setShowRecalculateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFoodCostModal, setShowFoodCostModal] = useState(false);
  const [recalculateFactor, setRecalculateFactor] = useState(1);
  const [recalculatedRecipe, setRecalculatedRecipe] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState({
    name: '',
    ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
    procedure: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [ingredientMappings, setIngredientMappings] = useState({});
  const [currentMappings, setCurrentMappings] = useState({});
  // Caricamento dati iniziali
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Carica le ricette
      const data = await api.getRecipes();
      setRecipes(data);
      console.log('Recipes loaded:', data);

      // Carica i prodotti dalle fatture nel database
      const invoices = await api.getInvoices();
      console.log('Invoices loaded:', invoices);

      const allProducts = {};
      
      invoices.forEach(invoice => {
        invoice.products.forEach(product => {
          if (!allProducts[product.id]) {
            allProducts[product.id] = {
              ...product,
              priceHistory: []
            };
          }
          allProducts[product.id].priceHistory.push({
            date: invoice.date,
            price: product.price,
            quantity: product.quantity,
            discounts: product.discounts
          });
        });
      });

      // Ordina la cronologia dei prezzi per data
      Object.values(allProducts).forEach(product => {
        product.priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      console.log('Processed products:', allProducts);
      setProducts(Object.values(allProducts));

    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      toast.error('Errore nel caricamento dei dati');
    }
  };

  const formatWeight = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams.toFixed(0)} gr`;
  };

  const calculateRecipeTotal = (ingredients) => {
    const totalInGrams = ingredients
      .filter(ing => !ing.isDivider)
      .reduce((sum, ing) => {
        const quantity = parseFloat(ing.quantity);
        return sum + (ing.unit === 'kg' ? quantity * 1000 : quantity);
      }, 0);

    const ingredientsWithPercentage = ingredients.map(ing => ({
      ...ing,
      percentage: ing.isDivider ? null : 
        ((parseFloat(ing.unit === 'kg' ? ing.quantity * 1000 : ing.quantity) / totalInGrams) * 100).toFixed(1)
    }));

    return { 
      totalWeight: totalInGrams,
      ingredients: ingredientsWithPercentage 
    };
  };

  const getProductDetails = (productId) => {
    console.log('Looking up product:', productId);
    const product = products.find(p => p.id === productId);
    if (!product || !product.priceHistory || product.priceHistory.length === 0) {
      console.log('Product not found or no price history:', productId);
      return null;
    }

    const details = {
      name: product.name,
      supplier: product.supplier,
      price: product.priceHistory[0].price, // Prende il prezzo più recente
      lastUpdated: product.priceHistory[0].date
    };
    console.log('Found product details:', details);
    return details;
  };

  const getAvailableProducts = () => {
    console.log('Getting available products from:', products);
    const validSuppliers = ['CEDIAL', 'DOLCIFORNITURE', 'PREGEL', 'EUROVO'];
    const availableProducts = products
      .filter(p => {
        const isValidSupplier = validSuppliers.includes(p.supplier);
        const hasPrice = p.priceHistory && p.priceHistory.length > 0;
        return isValidSupplier && hasPrice;
      })
      .map(p => ({
        ...p,
        currentPrice: p.priceHistory[0].price // Prende il prezzo più recente
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('Available products:', availableProducts);
    return availableProducts;
  };

  const handleFoodCostOpen = async (recipe) => {
    try {
      console.log('Starting handleFoodCostOpen with recipe:', recipe);
      setCurrentRecipe(recipe);
      
      // Verifichiamo che l'ID della ricetta sia presente
      if (!recipe._id) {
        console.error('Recipe ID is missing:', recipe);
        toast.error('ID ricetta mancante');
        return;
      }
      
      console.log('Fetching mappings for recipe:', recipe._id);
      const mappings = await api.getRecipeMappings(recipe._id);
      console.log('Received mappings:', mappings);
      
      // Assicuriamoci che mappings sia un oggetto valido
      const validMappings = mappings && typeof mappings === 'object' ? mappings : {};
      console.log('Setting current mappings:', validMappings);
      setCurrentMappings(validMappings);
      
      console.log('Opening modal');
      setShowFoodCostModal(true);
    } catch (error) {
      console.error('Error in handleFoodCostOpen:', error);
      toast.error(`Errore: ${error.message}`);
    }
  };
  const saveMappings = async () => {
    try {
      console.log('Starting saveMappings for recipe:', currentRecipe._id);
      
      if (!currentRecipe._id) {
        toast.error('ID ricetta mancante');
        return;
      }
      
      // Filtra le associazioni valide rimuovendo quelle vuote
      const validMappings = Object.entries(currentMappings).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log('Filtered mappings to save:', validMappings);

      // Salva nel database
      const savedMappings = await api.saveRecipeMappings(currentRecipe._id, validMappings);
      console.log('Response from save:', savedMappings);

      // Aggiorna lo stato locale
      setCurrentMappings(savedMappings);
      
      // Aggiorna la ricetta corrente
      setCurrentRecipe(prev => ({
        ...prev,
        ingredientMappings: savedMappings
      }));

      // Mostra messaggio di successo
      toast.success('Associazioni salvate con successo');
      
      // Ricarica i dati
      await loadInitialData();
      
      // Chiude il modal dopo il salvataggio
      setShowFoodCostModal(false);
      
    } catch (error) {
      console.error('Errore nel salvare le associazioni:', error);
      // Mostra messaggio di errore più dettagliato
      toast.error(`Errore nel salvare le associazioni: ${error.message}`);
    }
  };

  const calculateFoodCost = (recipe, mappings) => {
    console.log('Calculating food cost with mappings:', mappings);

    const ingredientCosts = recipe.ingredients
      .filter(ing => !ing.isDivider)
      .map(ing => {
        const productId = mappings[ing.name];
        console.log(`Looking up product for ${ing.name}:`, productId);
        
        const productDetails = getProductDetails(productId);
        console.log(`Product details for ${ing.name}:`, productDetails);
        
        const quantity = parseFloat(ing.quantity);
        let cost = 0;

        if (productDetails) {
          cost = ing.unit === 'kg' ? 
            quantity * productDetails.price : 
            (quantity / 1000) * productDetails.price;
        }

        return {
          name: ing.name,
          productName: productDetails ? `${productDetails.name} (${productDetails.supplier})` : 'Non associato',
          quantity: `${quantity} ${ing.unit}`,
          unitPrice: productDetails ? productDetails.price : 0,
          cost: cost,
          mapped: !!productDetails
        };
      });

    const totalCost = ingredientCosts.reduce((sum, ing) => sum + ing.cost, 0);

    return {
      ingredients: ingredientCosts.map(ing => ({
        ...ing,
        percentage: totalCost > 0 ? ((ing.cost / totalCost) * 100).toFixed(1) : '0'
      })),
      total: totalCost
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateRecipe(currentRecipe._id, currentRecipe);
        toast.success('Ricetta aggiornata con successo');
      } else {
        await api.createRecipe(currentRecipe);
        toast.success('Ricetta creata con successo');
      }
      await loadInitialData();
      setShowNewRecipeForm(false);
      setCurrentRecipe({
        name: '',
        ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
        procedure: ''
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Errore nel salvare la ricetta:', error);
      toast.error('Errore nel salvare la ricetta');
    }
  };
  const addIngredient = (isDivider = false) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { 
        name: isDivider ? '---' : '', 
        quantity: '', 
        unit: 'gr',
        isDivider 
      }]
    }));
  };

  const removeIngredient = (index) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, field, value) => {
    setCurrentRecipe(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value
      };
      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  const editRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setIsEditing(true);
    setShowNewRecipeForm(true);
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      try {
        await api.deleteRecipe(id);
        await loadInitialData();
        toast.success('Ricetta eliminata con successo');
      } catch (error) {
        console.error('Errore nell\'eliminazione della ricetta:', error);
        toast.error('Errore nell\'eliminazione della ricetta');
      }
    }
  };

  const recalculateQuantities = () => {
    const factor = parseFloat(recalculateFactor);
    if (isNaN(factor) || factor <= 0) {
      toast.error('Inserisci un numero valido maggiore di 0');
      return;
    }

    const recalculatedIngredients = currentRecipe.ingredients.map(ing => ({
      ...ing,
      quantity: ing.isDivider ? '' : (parseFloat(ing.quantity) * factor).toFixed(2)
    }));

    setRecalculatedRecipe({
      ...currentRecipe,
      ingredients: recalculatedIngredients
    });

    setShowRecalculateModal(false);
    setShowViewModal(true);
  };

  const printRecipe = (recipe, mode = 'normal') => {
    if (mode === 'normal' || mode === 'recalculated') {
      const { totalWeight, ingredients } = calculateRecipeTotal(recipe.ingredients);
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
                font-size: 12px;
                margin: 0;
                padding: 4mm;
                width: 72mm;
              }
              .title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 4mm;
                text-align: center;
              }
              .ingredients {
                margin-bottom: 4mm;
              }
              .ingredient {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1mm;
              }
              .divider {
                border-top: 1px dashed #000;
                margin: 2mm 0;
              }
              .total {
                font-weight: bold;
                margin-top: 2mm;
                text-align: right;
              }
              .procedure {
                margin-top: 4mm;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div class="title">${recipe.name}</div>
            <div class="ingredients">
              ${ingredients.map(ing => 
                ing.isDivider ? 
                  '<div class="divider"></div>' :
                  `<div class="ingredient">
                    <span>${ing.name}</span>
                    <span>${ing.quantity} ${ing.unit} (${ing.percentage}%)</span>
                  </div>`
              ).join('')}
              <div class="total">Peso totale: ${formatWeight(totalWeight)}</div>
            </div>
            <div class="procedure">
              ${recipe.procedure}
            </div>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else if (mode === 'foodcost') {
      const foodCost = calculateFoodCost(recipe, currentMappings);
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
                font-size: 12px;
                margin: 0;
                padding: 4mm;
                width: 72mm;
              }
              .title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 4mm;
                text-align: center;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 2mm;
              }
              th, td {
                padding: 1mm;
                text-align: left;
                font-size: 10px;
              }
              th {
                border-bottom: 1px solid #000;
              }
              .total {
                font-weight: bold;
                margin-top: 2mm;
                border-top: 1px solid #000;
              }
              .unmapped {
                background-color: #f0f0f0;
              }
            </style>
          </head>
          <body>
            <div class="title">Food Cost: ${recipe.name}</div>
            <table>
              <tr>
                <th>Ingrediente</th>
                <th>Prezzo/kg</th>
                <th>Costo</th>
              </tr>
              ${foodCost.ingredients.map(ing => `
                <tr class="${!ing.mapped ? 'unmapped' : ''}">
                  <td>${ing.name}</td>
                  <td>€${ing.unitPrice.toFixed(2)}</td>
                  <td>€${ing.cost.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total">
                <td colspan="2">Totale</td>
                <td>€${foodCost.total.toFixed(2)}</td>
              </tr>
            </table>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Modal Food Cost */}
        {showFoodCostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-[#8B4513]">
                    Food Cost: {currentRecipe.name}
                  </h2>
                  <button
                    onClick={() => setShowFoodCostModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Associa Ingredienti ai Prodotti</h3>
                  {currentRecipe.ingredients.map((ing, index) => !ing.isDivider && (
                    <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
                      <div className="w-full md:w-1/3">
                        <span className="block md:inline">{ing.name}</span>
                      </div>
                      <div className="w-full md:w-2/3">
                      <select
                        value={currentMappings[ing.name] || ''}
                        onChange={(e) => {
                        setCurrentMappings(prev => ({
                        ...prev,
                        [ing.name]: e.target.value
                      }));
                      }}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                      >
                      <option value="">Seleziona prodotto</option>
                      {getAvailableProducts().map(product => (
                      <option 
                      key={product.id} 
                       value={product.id}
                      >
                      {product.name} ({product.supplier}) - €{product.currentPrice.toFixed(2)}
                      </option>
                      ))}
                      </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Riepilogo Costi</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Ingrediente</th>
                          <th className="px-4 py-2 text-left">Prodotto Associato</th>
                          <th className="px-4 py-2 text-right">Quantità</th>
                          <th className="px-4 py-2 text-right">Prezzo/kg</th>
                          <th className="px-4 py-2 text-right">Costo</th>
                          <th className="px-4 py-2 text-right">% sul Totale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {calculateFoodCost(currentRecipe, currentMappings).ingredients.map((ing, index) => (
                          <tr key={index} className={!ing.mapped ? 'bg-yellow-50' : ''}>
                            <td className="px-4 py-2">{ing.name}</td>
                            <td className="px-4 py-2">{ing.productName}</td>
                            <td className="px-4 py-2 text-right">{ing.quantity}</td>
                            <td className="px-4 py-2 text-right">€{ing.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">€{ing.cost.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">{ing.percentage}%</td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-50">
                          <td colSpan="4" className="px-4 py-2">Costo Totale</td>
                          <td className="px-4 py-2 text-right">
                            €{calculateFoodCost(currentRecipe, currentMappings).total.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => printRecipe(currentRecipe, 'foodcost')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Printer className="h-5 w-5" />
                    <span className="hidden md:inline">Stampa</span>
                  </button>
                  <button
                    onClick={saveMappings}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    <span className="hidden md:inline">Salva Associazioni</span>
                  </button>
                  <button
                    onClick={() => setShowFoodCostModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal Ricalcolo */}
        {showRecalculateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-4">
                <h2 className="text-xl font-bold text-[#8B4513] mb-4">Ricalcola Quantità</h2>
                <p className="mb-4 text-gray-600">
                  Inserisci il fattore di moltiplicazione. Ad esempio:
                  <br/>• 2 per raddoppiare le quantità
                  <br/>• 0.5 per dimezzarle
                </p>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={recalculateFactor}
                  onChange={(e) => setRecalculateFactor(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowRecalculateModal(false);
                      setRecalculateFactor(1);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={recalculateQuantities}
                    className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]"
                  >
                    Ricalcola
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Visualizza */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#8B4513]">
                    {recalculatedRecipe ? recalculatedRecipe.name : currentRecipe.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setRecalculatedRecipe(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-[#A0522D] mb-2">Ingredienti:</h3>
                  {(() => {
                    const recipe = recalculatedRecipe || currentRecipe;
                    const { totalWeight, ingredients } = calculateRecipeTotal(recipe.ingredients);
                    
                    return (
                      <>
                        <div className="space-y-1">
                          {ingredients.map((ing, index) => (
                            ing.isDivider ? (
                              <div key={index} className="border-t border-gray-300 my-2"></div>
                            ) : (
                              <div key={index} className="flex justify-between">
                                <span>{ing.name}</span>
                                <span>{ing.quantity} {ing.unit} ({ing.percentage}%)</span>
                              </div>
                            )
                          ))}
                        </div>
                        <div className="mt-4 text-right font-medium text-gray-700">
                          Peso totale: {formatWeight(totalWeight)}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-[#A0522D] mb-2">Procedimento:</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {(recalculatedRecipe || currentRecipe).procedure}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => printRecipe(recalculatedRecipe || currentRecipe)}
                    className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] flex items-center gap-2"
                  >
                    <Printer className="h-5 w-5" />
                    Stampa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showNewRecipeForm ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-[#8B4513]">
                {isEditing ? 'Modifica Ricetta' : 'Nuova Ricetta'}
              </h1>
              <button
                onClick={() => {
                  setShowNewRecipeForm(false);
                  setCurrentRecipe({
                    name: '',
                    ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
                    procedure: ''
                  });
                  setIsEditing(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Ricetta
                </label>
                <input
                  type="text"
                  required
                  value={currentRecipe.name}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredienti
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addIngredient(true)}
                      className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      title="Aggiungi linea divisoria"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addIngredient(false)}
                      className="text-[#8B4513] hover:text-[#A0522D] flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden md:inline">Aggiungi Ingrediente</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    ingredient.isDivider ? (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div key={index} className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Nome ingrediente"
                            required={!ingredient.isDivider}
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                            list={`ingredients-${index}`}
                          />
                          <datalist id={`ingredients-${index}`}>
                            {getAvailableProducts().map(product => (
                              <option key={product.id} value={product.name}>
                                {product.name} ({product.supplier})
                              </option>
                            ))}
                          </datalist>
                        </div>
                        <div className="w-full md:w-24">
                          <input
                            type="number"
                            step="0.001"
                            placeholder="Quantità"
                            required={!ingredient.isDivider}
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                          />
                        </div>
                        <div className="w-full md:w-24">
                          <select
                            value={ingredient.unit}
                            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                          >
                            <option value="gr">gr</option>
                            <option value="kg">kg</option>
                          </select>
                        </div>
                        {currentRecipe.ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Procedimento
                </label>
                <textarea
                  required
                  value={currentRecipe.procedure}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, procedure: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513] h-48"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] flex items-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  {isEditing ? 'Aggiorna' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D]"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Torna alla Home</span>
              </Link>
              <button
                onClick={() => setShowNewRecipeForm(true)}
                className="w-full md:w-auto px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Nuova Ricetta</span>
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cerca ricetta..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#8B4513] text-white">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nome Ricetta</th>
                      <th className="px-4 py-3 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recipes
                      .filter(recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(recipe => (
                        <tr key={recipe._id} className="hover:bg-amber-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#8B4513]">{recipe.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setCurrentRecipe({...recipe});
                                  setShowViewModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Visualizza"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentRecipe({...recipe});
                                  setShowRecalculateModal(true);
                                }}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                                title="Ricalcola Quantità"
                              >
                                <Calculator className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleFoodCostOpen(recipe)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Food Cost"
                              >
                                <DollarSign className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => editRecipe(recipe)}
                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"
                                title="Modifica"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteRecipe(recipe._id)}
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
        )}
      </div>
    </Layout>
  );
};

export default RecipeManager;