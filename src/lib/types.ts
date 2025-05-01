// src/lib/types.ts

export type APIResponse<T> = {
    data: T;
    message: string;
  };
  
  export type AuthResponse = {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: "farmer" | "laborer";
      address: string;
      phoneNumber: string;
      landArea: number;
      cropType: string;
    };
  };
  
  export type Order = {
    id: string;
    description: string;
    createdAt: string;
    status: "pending" | "accepted" | "completed" | "cancelled";
    farmerId: string;
    laborerId: string;
    laborer?: {
      id: string;
      username: string;
    };
  };
  
  export type LoginDto = {
    username: string;
    password: string;
  };
  
  export type RegisterFarmerDto = {
    username: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    landArea: number;
    cropType: string;
  };
  
  export type RegisterLaborerDto = {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
    skills: string[];
    experience: string;
  };
  
  export interface CreateOrderDto {
    laborerId: number;
    description: string;
    wage: number;
    startDate: string;
    endDate: string;
  }
  