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
      role: 'farmer' | 'worker';
    };
  };
  
  export type Order = {
    id: string;
    description: string;
    createdAt: string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    farmerId: string;
    laborerId: string;
  };
  
  export type LoginDto = {
    email: string;
    password: string;
  };
  
  export type RegisterFarmerDto = {
    username: string;
    email: string;
    password: string;
  };
  
  export type RegisterLaborerDto = {
    username: string;
    email: string;
    password: string;
    skill: string;
  };
  