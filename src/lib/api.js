const BASE_URL = '/api';

export const api = {
  // Recipe APIs
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

  // New Ingredient Mappings APIs
  async getRecipeMappings(recipeId) {
    const res = await fetch(`${BASE_URL}/recipes/${recipeId}/mappings`);
    if (!res.ok) throw new Error('Failed to fetch ingredient mappings');
    return res.json();
  },

  async saveRecipeMappings(recipeId, mappings) {
    const res = await fetch(`${BASE_URL}/recipes/${recipeId}/mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mappings })
    });
    if (!res.ok) throw new Error('Failed to save ingredient mappings');
    return res.json();
  },

  // Orders APIs (manteniamo quelle esistenti)
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

  // Invoices APIs (manteniamo quelle esistenti)
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