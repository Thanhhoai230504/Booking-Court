// User types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'owner' | 'admin';
  avatar?: string;
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
  role?: 'customer' | 'owner' | 'admin';
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
  status: 'active' | 'maintenance' | 'inactive';
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
  courtNumber?: number;
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
  courtNumber?: number;
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

// Drink types
export interface Drink {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  minStock: number;
  description?: string;
  image?: string;
  adminId?: string;
}

// Admin types
export interface DashboardData {
  totalRevenue: number;
  courtRevenue: number;
  drinkRevenue: number;
  transactionCount: number;
  revenues: Array<{
    _id: string;
    bookingId: { _id: string; bookingNumber: string };
    courtId: { _id: string; name: string };
    courtRevenue: number;
    drinkRevenue: number;
    totalRevenue: number;
    date: string;
    completedAt: string;
  }>;
}

export interface RevenueByDate {
  _id: string;
  totalRevenue: number;
  courtRevenue: number;
  drinkRevenue: number;
  transactionCount: number;
}

export interface RevenueByMonth {
  _id: string;
  totalRevenue: number;
  courtRevenue: number;
  drinkRevenue: number;
  transactionCount: number;
}

export interface RevenueByCourt {
  _id: string;
  totalRevenue: number;
  courtRevenue: number;
  drinkRevenue: number;
  transactionCount: number;
  courtDetails: {
    _id: string;
    name: string;
    address: string;
  };
}

export interface CreateCourtRequest {
  name: string;
  address: string;
  city?: string;
  description?: string;
  totalCourts: number;
  pricePerHour: number;
  openingHours?: { start: string; end: string };
  hourlyPricing?: HourlyPricing[];
  images?: string[];
}

export interface UpdateCourtRequest {
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  totalCourts?: number;
  pricePerHour?: number;
  status?: 'active' | 'maintenance' | 'inactive';
  openingHours?: { start: string; end: string };
  hourlyPricing?: HourlyPricing[];
  images?: string[];
}

export interface CreateDrinkRequest {
  name: string;
  price: number;
  quantity?: number;
  minStock?: number;
  description?: string;
  image?: string;
}

export interface UpdateDrinkRequest {
  name?: string;
  price?: number;
  minStock?: number;
  description?: string;
  image?: string;
}
