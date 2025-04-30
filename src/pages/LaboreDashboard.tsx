// API base URL
const API_BASE_URL = "https://web-pemesanan-buruh-be.vercel.app/api"

// Types based on API schema
export interface LoginDto {
  username: string
  password: string
}

export interface RegisterFarmerDto {
  username: string
  password: string
  email: string
  address: string
  phoneNumber: string
  landArea: number
  cropType: string
}

export interface RegisterLaborerDto {
  username: string
  password: string
  email: string
  address: string
  phoneNumber: string
  age: number
  skills: string[]
  experience: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    role: "farmer" | "laborer"
    name: string
  }
}

export interface Order {
  id: string
  farmerId: string
  farmerName: string
  laborerId?: string
  laborerName?: string
  description: string
  location: string
  startDate: string
  endDate: string
  wage: number
  status: "pending" | "accepted" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

// Auth API functions
export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }

  return response.json()
}

export async function registerFarmer(data: RegisterFarmerDto): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/farmer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Farmer registration failed")
  }

  return response.json()
}

export async function registerLaborer(data: RegisterLaborerDto): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/laborer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Laborer registration failed")
  }

  return response.json()
}

// Orders API functions
export async function createOrder(token: string, orderData: any): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create order")
  }

  return response.json()
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch orders")
  }

  return response.json()
}

export async function getMyPlacedOrders(token: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders/my-placed-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch placed orders")
  }

  return response.json()
}

export async function updateOrderStatus(token: string, orderId: string, status: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update order status")
  }

  return response.json()
}
