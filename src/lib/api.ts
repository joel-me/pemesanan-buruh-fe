import {
  APIResponse,
  AuthResponse,
  Order,
  LoginDto,
  RegisterFarmerDto,
  RegisterLaborerDto,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables.");
}

// Auth API functions
export async function login(data: LoginDto): Promise<APIResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function registerFarmer(data: RegisterFarmerDto): Promise<APIResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/register/farmer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Farmer registration failed");
  }

  return response.json();
}

export async function registerLaborer(data: RegisterLaborerDto): Promise<APIResponse<AuthResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/register/laborer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Laborer registration failed");
  }

  return response.json();
}

// Orders API functions
export async function createOrder(token: string, orderData: any): Promise<APIResponse<Order>> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return response.json();
}

export async function getMyOrders(token: string): Promise<APIResponse<Order[]>> {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return response.json();
}

export async function getMyPlacedOrders(token: string): Promise<APIResponse<Order[]>> {
  const response = await fetch(`${API_BASE_URL}/orders/my-placed-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch placed orders");
  }

  return response.json();
}

export async function updateOrderStatus(
  token: string,
  orderId: string,
  status: string
): Promise<APIResponse<Order>> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update order status");
  }

  return response.json();
}
