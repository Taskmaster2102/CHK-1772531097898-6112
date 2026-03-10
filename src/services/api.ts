// API service layer for connecting frontend to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
}

// Product types
export interface Product {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

// Order types
export interface TrackingSteps {
  confirmed: boolean;
  shaping: boolean;
  firing: boolean;
  glazing: boolean;
  shipped: boolean;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  email: string;
  shape: 'Classic' | 'Tapered' | 'Fluted';
  size: 'S' | 'M' | 'L';
  glazeColor: string;
  engraving: string;
  price: number;
  orderDate: string;
  status: 'In Production' | 'Shipped' | 'Delivered';
  productionStatus: 'Shaping' | 'Firing' | 'Glazing' | 'Ready';
  trackingSteps: TrackingSteps;
  notes?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Something went wrong' };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Failed to connect to server' };
  }
}

// User API
export const userApi = {
  register: (userData: { email: string; password: string; name: string; role: string }) =>
    apiCall<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiCall<{ user: User; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getById: (id: string) => apiCall<User>(`/users/${id}`),
};

// Product API
export const productApi = {
  getAll: () => apiCall<Product[]>('/products'),

  getById: (id: number) => apiCall<Product>(`/products/${id}`),

  create: (product: Omit<Product, '_id'>) =>
    apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id: number, product: Partial<Product>) =>
    apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (id: number) =>
    apiCall<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  seed: () =>
    apiCall<{ message: string; count: number }>('/products/seed', {
      method: 'POST',
    }),
};

// Order API
export const orderApi = {
  getAll: () => apiCall<Order[]>('/orders'),

  getByUserId: (userId: string) => apiCall<Order[]>(`/orders/user/${userId}`),

  getById: (id: string) => apiCall<Order>(`/orders/${id}`),

  create: (orderData: {
    userId: string;
    customerName: string;
    email: string;
    shape: string;
    size: string;
    glazeColor: string;
    engraving: string;
    price: number;
    notes?: string;
  }) =>
    apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id: string, productionStatus: string) =>
    apiCall<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ productionStatus }),
    }),

  shipOrder: (id: string, trackingNumber?: string) =>
    apiCall<Order>(`/orders/${id}/ship`, {
      method: 'PUT',
      body: JSON.stringify({ trackingNumber }),
    }),

  update: (id: string, orderData: Partial<Order>) =>
    apiCall<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/orders/${id}`, {
      method: 'DELETE',
    }),

  seed: () =>
    apiCall<{ message: string; count: number }>('/orders/seed', {
      method: 'POST',
    }),
};

// Health check
export const healthApi = {
  check: () => apiCall<{ status: string; message: string }>('/health'),
};

export default {
  user: userApi,
  product: productApi,
  order: orderApi,
  health: healthApi,
};

