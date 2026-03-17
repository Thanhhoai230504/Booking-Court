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

// Booking types
export interface DrinkItem {
  drinkId: string;
  name: string;
  price: number;
  quantity: number;
  addedAt?: string;
}

export interface RecurringRule {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate: string;
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  customerId: string | User;
  courtId: string | Court;
  adminId?: string;
  bookingType: 'single' | 'recurring';
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  courtPrice: number;
  drinkItems: DrinkItem[];
  totalDrinkPrice: number;
  totalPrice: number;
  status: 'PENDING_APPROVAL' | 'CONFIRMED' | 'PLAYING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentProof?: string;
  recurringRule?: RecurringRule;
  notes?: string;
  createdAt?: string;
  completedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface CreateBookingRequest {
  courtId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  customerName: string;
  customerPhone: string;
  bookingType: 'single' | 'recurring';
  paymentMethod: 'online' | 'cash';
  paymentProof?: string;
  recurringRule?: RecurringRule;
}