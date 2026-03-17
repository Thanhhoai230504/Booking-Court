// User types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "customer" | "admin";
}
// Court types
export interface OpeningHours {
  start: string;
  end: string;
}

export interface HourlyPricing {
  hour: string;
  price: number;
}

export interface Court {
  _id: string;
  name: string;
  address: string;
  city?: string;
  pricePerHour: number;
  status: "active" | "maintenance" | "inactive";
  images: string[];
  description?: string;
  totalCourts: number;
  openingHours: OpeningHours;
  hourlyPricing?: HourlyPricing[];
  adminId?: {
    _id: string;
    name: string;
    phone: string;
  };
  createdAt?: string;
}
