// src/lib/api.js

const BASE_URL = '/api';

export const api = {
  // Recipes
  async getRecipes() {
    const res = await fetch(`${BASE_URL}/recipes`);
    if (!res.ok) throw new Error('Failed to fetch recipes');
    return res.json();
  },

  async createRecipe(recipe) {
    const res = await fetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!res.ok) throw new Error('Failed to create recipe');
    return res.json();
  },

  async updateRecipe(id, recipe) {
    const res = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!res.ok) throw new Error('Failed to update recipe');
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete recipe');
    return res.json();
  },

  // Ingredient Mappings
  async getMappings(recipeId = null) {
    const url = recipeId 
      ? `${BASE_URL}/ingredient-mappings?recipeId=${recipeId}`
      : `${BASE_URL}/ingredient-mappings`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch ingredient mappings');
    return res.json();
  },

  async saveMappings(mappings, recipeId) {
    const res = await fetch(`${BASE_URL}/ingredient-mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mappings, recipeId })
    });
    if (!res.ok) throw new Error('Failed to save ingredient mappings');
    return res.json();
  },

  async updateMapping(id, mapping) {
    const res = await fetch(`${BASE_URL}/ingredient-mappings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapping)
    });
    if (!res.ok) throw new Error('Failed to update ingredient mapping');
    return res.json();
  },

  async deleteMapping(id) {
    const res = await fetch(`${BASE_URL}/ingredient-mappings/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete ingredient mapping');
    return res.json();
  },

  async deleteMappingsByRecipe(recipeId) {
    const res = await fetch(`${BASE_URL}/ingredient-mappings?recipeId=${recipeId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete recipe mappings');
    return res.json();
  },

  // Orders (manteniamo le funzioni esistenti)
  async getOrders() {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(order) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async updateOrder(id, order) {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Invoices (manteniamo le funzioni esistenti)
  async getInvoices() {
    const res = await fetch(`${BASE_URL}/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  async createInvoice(invoice) {
    const res = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },

  async updateInvoice(id, invoice) {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return res.json();
  },

  async deleteInvoice(id) {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return res.json();
  }
};