import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash, Printer, ArrowLeft, X, Save, Calculator, Eye, Minus, DollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

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
    id: null,
    name: '',
    ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
    procedure: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [ingredientMappings, setIngredientMappings] = useState({});
  const [currentMappings, setCurrentMappings] = useState({});

  // Caricamento dati iniziali
  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    const storedProducts = localStorage.getItem('products');
    const storedMappings = localStorage.getItem('ingredientMappings');
    
    if (storedRecipes) setRecipes(JSON.parse(storedRecipes));
    if (storedProducts) {
      const productsData = JSON.parse(storedProducts);
      const productsWithIds = productsData.map(product => ({
        ...product,
        id: product.id || `${product.supplier}-${product.name}`.replace(/\s+/g, '-').toLowerCase()
      }));
      setProducts(productsWithIds);
    }
    if (storedMappings) setIngredientMappings(JSON.parse(storedMappings));
  }, []);

  // Funzione di formattazione peso
  const formatWeight = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams.toFixed(0)} gr`;
  };
  // Funzioni di calcolo
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

  const getLatestPriceForProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product?.priceHistory?.length > 0) {
      return product.priceHistory[0].price;
    }
    return 0;
  };

  const getProductDetails = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    return {
      name: product.name,
      supplier: product.supplier,
      price: product.priceHistory?.[0]?.price || 0
    };
  };

  const calculateFoodCost = (recipe, mappings) => {
    const ingredientCosts = recipe.ingredients
      .filter(ing => !ing.isDivider)
      .map(ing => {
        const productId = mappings[ing.name];
        const productDetails = getProductDetails(productId);
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
  // Funzioni di gestione ricette
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedRecipes = recipes.map(recipe =>
        recipe.id === currentRecipe.id ? currentRecipe : recipe
      );
      setRecipes(updatedRecipes);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    } else {
      const newRecipe = {
        ...currentRecipe,
        id: Date.now()
      };
      const updatedRecipes = [...recipes, newRecipe];
      setRecipes(updatedRecipes);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    }
    setShowNewRecipeForm(false);
    setCurrentRecipe({
      id: null,
      name: '',
      ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
      procedure: ''
    });
    setIsEditing(false);
  };

  const addIngredient = (isDivider = false) => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: [...currentRecipe.ingredients, { 
        name: isDivider ? '---' : '', 
        quantity: '', 
        unit: 'gr',
        isDivider 
      }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = currentRecipe.ingredients.filter((_, i) => i !== index);
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: newIngredients
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...currentRecipe.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: newIngredients
    });
  };

  const editRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setIsEditing(true);
    setShowNewRecipeForm(true);
  };

  const deleteRecipe = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
      setRecipes(updatedRecipes);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    }
  };
  // Funzioni Food Cost
  const handleFoodCostOpen = (recipe) => {
    setCurrentRecipe(recipe);
    const existingMappings = {};
    recipe.ingredients.forEach(ing => {
      if (!ing.isDivider) {
        const existingMapping = ingredientMappings[ing.name];
        if (existingMapping) {
          existingMappings[ing.name] = existingMapping;
        }
      }
    });
    setCurrentMappings(existingMappings);
    setShowFoodCostModal(true);
  };

  const getAvailableProducts = () => {
    const validSuppliers = ['CEDIAL', 'DOLCIFORNITURE', 'PREGEL', 'EUROVO'];
    return products
      .filter(p => validSuppliers.includes(p.supplier))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const saveMappings = () => {
    const validMappings = Object.entries(currentMappings).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const updatedMappings = { ...ingredientMappings, ...validMappings };
    setIngredientMappings(updatedMappings);
    localStorage.setItem('ingredientMappings', JSON.stringify(updatedMappings));
    setCurrentMappings(validMappings);
  };

  const recalculateQuantities = () => {
    const factor = parseFloat(recalculateFactor);
    if (isNaN(factor) || factor <= 0) {
      alert('Inserisci un numero valido maggiore di 0');
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
  // Funzioni di stampa
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
      <div className="max-w-7xl mx-auto p-6">
        {/* MODAL FOOD COST */}
        {showFoodCostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[#8B4513]">
                  Food Cost: {currentRecipe.name}
                </h2>
                <button
                  onClick={() => setShowFoodCostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Associa Ingredienti ai Prodotti</h3>
                {currentRecipe.ingredients.map((ing, index) => !ing.isDivider && (
                  <div key={index} className="flex gap-4 items-center mb-2">
                    <div className="w-1/3">
                      <span>{ing.name}</span>
                    </div>
                    <div className="w-2/3">
                      <select
                        value={currentMappings[ing.name] || ''}
                        onChange={(e) => {
                          const newMappings = {
                            ...currentMappings,
                            [ing.name]: e.target.value
                          };
                          setCurrentMappings(newMappings);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
                      >
                        <option value="">Seleziona prodotto</option>
                        {getAvailableProducts().map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.supplier})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Riepilogo Costi</h3>
                {(() => {
                  const foodCost = calculateFoodCost(currentRecipe, currentMappings);
                  return (
                    <table className="w-full">
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
                        {foodCost.ingredients.map((ing, index) => (
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
                          <td className="px-4 py-2 text-right">€{foodCost.total.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => printRecipe(currentRecipe, 'foodcost')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer className="h-5 w-5" />
                  Stampa
                </button>
                <button
                  onClick={saveMappings}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  Salva Associazioni
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
        )}
        {/* MODAL RICALCOLO */}
        {showRecalculateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
        )}

        {/* MODAL VISUALIZZAZIONE */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
        )}
        {/* CONTENUTO PRINCIPALE: FORM O LISTA */}
        {showNewRecipeForm ? (
          /* Form Creazione/Modifica Ricetta */
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#8B4513]">
                {isEditing ? 'Modifica Ricetta' : 'Nuova Ricetta'}
              </h1>
              <button
                onClick={() => {
                  setShowNewRecipeForm(false);
                  setCurrentRecipe({
                    id: null,
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
              {/* Nome Ricetta */}
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

              {/* Ingredienti */}
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
                      Aggiungi Ingrediente
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
                      <div key={index} className="flex gap-2 items-start">
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
                        <div className="w-24">
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
                        <div className="w-24">
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

              {/* Procedimento */}
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

              {/* Pulsanti Form */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewRecipeForm(false);
                    setCurrentRecipe({
                      id: null,
                      name: '',
                      ingredients: [{ name: '', quantity: '', unit: 'gr', isDivider: false }],
                      procedure: ''
                    });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annulla
                </button>
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
          /* Lista Ricette */
          <>
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#8B4513] hover:text-[#A0522D]"
              >
                <ArrowLeft className="h-5 w-5" />
                Torna alla Home
              </Link>
              <button
                onClick={() => setShowNewRecipeForm(true)}
                className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nuova Ricetta
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
                        <tr key={recipe.id} className="hover:bg-amber-50">
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
                                onClick={() => deleteRecipe(recipe.id)}
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default RecipeManager;