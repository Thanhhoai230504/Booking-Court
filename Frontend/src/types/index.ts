export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
    isAdmin: boolean;
    createdAt: string;
}

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
    city: string;
    images: string[];
    description: string;
    totalCourts: number;
    status: 'active' | 'maintenance' | 'inactive';
    openingHours: OpeningHours;
    pricePerHour: number;
    hourlyPricing: HourlyPricing[];
    adminId: string | User;
    createdAt: string;
    rating?: number;
    reviewCount?: number;
}

export interface DrinkItem {
    drinkId: string;
    name: string;
    price: number;
    quantity: number;
    addedAt: string;
}

export interface RecurringRule {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    interval: number;
    endDate: string;
    recurringBookingIds: string[];
}

export interface Booking {
    _id: string;
    bookingNumber: string;
    customerId: string | User;
    courtId: string | Court;
    adminId: string | User;
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
    createdAt: string;
    completedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
}

export interface Drink {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    minStock: number;
    adminId: string;
    description?: string;
    createdAt: string;
}

export type BookingTypeOption = 'single' | 'recurring' | 'event';

export interface TimeSlot {
    time: string;
    status: 'available' | 'booked' | 'locked' | 'event';
    bookingId?: string;
}

export interface CourtTimeSlots {
    courtName: string;
    courtIndex: number;
    slots: TimeSlot[];
}
