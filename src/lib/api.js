const BASE_URL = '';

export const api = {
  // Recipe APIs
  async getRecipes() {
    const res = await fetch(`${BASE_URL}/api/recipes`);
    if (!res.ok) throw new Error('Failed to fetch recipes');
    return res.json();
  },

  async createRecipe(recipe) {
    const res = await fetch(`${BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!res.ok) throw new Error('Failed to create recipe');
    return res.json();
  },

  async updateRecipe(id, recipe) {
    const res = await fetch(`${BASE_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!res.ok) throw new Error('Failed to update recipe');
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch(`${BASE_URL}/api/recipes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete recipe');
    return res.json();
  },

  // Recipe Mappings APIs
  async getRecipeMappings(recipeId) {
    console.log('Fetching mappings for recipe:', recipeId);
    try {
      const res = await fetch(`${BASE_URL}/api/recipes/${recipeId}/mappings`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch mappings');
      }
      const data = await res.json();
      console.log('Received mappings:', data);
      return data;
    } catch (error) {
      console.error('Error fetching mappings:', error);
      throw error;
    }
  },

  async saveRecipeMappings(recipeId, mappings) {
    console.log('Saving mappings:', { recipeId, mappings });
    try {
      const res = await fetch(`${BASE_URL}/api/recipes/${recipeId}/mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save mappings');
      }
      const data = await res.json();
      console.log('Saved mappings:', data);
      return data;
    } catch (error) {
      console.error('Error saving mappings:', error);
      throw error;
    }
  },

  // Orders APIs
  async getOrders() {
    const res = await fetch(`${BASE_URL}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(order) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async updateOrder(id, order) {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Invoices APIs
  async getInvoices() {
    const res = await fetch(`${BASE_URL}/api/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  async createInvoice(invoice) {
    const res = await fetch(`${BASE_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },

  async updateInvoice(id, invoice) {
    const res = await fetch(`${BASE_URL}/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return res.json();
  },

  async deleteInvoice(id) {
    const res = await fetch(`${BASE_URL}/api/invoices/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return res.json();
  }
};