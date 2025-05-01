import {
  APIResponse,
  AuthResponse,
  Order,
  LoginDto,
  RegisterFarmerDto,
  RegisterLaborerDto,
  CreateOrderDto,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables.");
}

const API_PREFIX = `${API_BASE_URL}/api`;

// Utility function to handle fetch errors
const handleFetchError = async (response: Response) => {
  const error = await response.json();
  throw new Error(error.message || 'Request failed');
};

// Utility function to handle successful fetch response
const handleFetchSuccess = async <T>(response: Response): Promise<APIResponse<T>> => {
  if (!response.ok) {
    await handleFetchError(response);
  }
  return response.json();
};

// Auth API functions
export const login = async (data: LoginDto): Promise<APIResponse<AuthResponse>> => {
  const response = await fetch(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleFetchSuccess<AuthResponse>(response);
};

export const registerFarmer = async (data: RegisterFarmerDto): Promise<APIResponse<AuthResponse>> => {
  const response = await fetch(`${API_PREFIX}/auth/register/farmer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleFetchSuccess<AuthResponse>(response);
};

export const registerLaborer = async (data: RegisterLaborerDto): Promise<APIResponse<AuthResponse>> => {
  const response = await fetch(`${API_PREFIX}/auth/register/laborer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleFetchSuccess<AuthResponse>(response);
};

// Orders API functions
export const createOrder = async (token: string, orderData: CreateOrderDto): Promise<APIResponse<Order>> => {
  const response = await fetch(`${API_PREFIX}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  return handleFetchSuccess<Order>(response);
};

export const getMyOrders = async (token: string): Promise<APIResponse<Order[]>> => {
  const response = await fetch(`${API_PREFIX}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleFetchSuccess<Order[]>(response);
};

export const getMyPlacedOrders = async (token: string): Promise<APIResponse<Order[]>> => {
  const response = await fetch(`${API_PREFIX}/orders/my-placed-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleFetchSuccess<Order[]>(response);
};

export const updateOrderStatus = async (
  token: string,
  orderId: string,
  status: string
): Promise<APIResponse<Order>> => {
  const response = await fetch(`${API_PREFIX}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return handleFetchSuccess<Order>(response);
};

// New function to get laborer data
export const getLaborerData = async (token: string): Promise<APIResponse<any>> => {
  const response = await fetch(`${API_PREFIX}/laborer/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleFetchSuccess<any>(response);
};
