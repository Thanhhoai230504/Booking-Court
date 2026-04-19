const Booking = require('../../src/models/Booking');
const Court = require('../../src/models/Court');
const Drink = require('../../src/models/Drink');
const Revenue = require('../../src/models/Revenue');
const bookingService = require('../../src/services/bookingService');

jest.mock('../../src/models/Booking');
jest.mock('../../src/models/Court');
jest.mock('../../src/models/Drink');
jest.mock('../../src/models/Revenue');

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create booking successfully', async () => {
      const mockCourt = {
        _id: 'court1',
        adminId: 'admin1',
        pricePerHour: 100000,
      };
      Court.findById.mockResolvedValue(mockCourt);

      const mockBooking = {
        _id: 'booking1',
        customerId: 'user1',
        courtId: 'court1',
        adminId: 'admin1',
        courtPrice: 200000,
        totalPrice: 200000,
        status: 'PENDING_APPROVAL',
        save: jest.fn().mockResolvedValue(true),
      };
      Booking.mockImplementation(() => mockBooking);

      const result = await bookingService.createBooking('user1', {
        courtId: 'court1',
        startDate: '2026-05-01',
        startTime: '08:00',
        endTime: '10:00',
        durationHours: 2,
        customerName: 'Test',
        customerPhone: '0901234567',
      });

      expect(result.message).toBe('Booking created successfully');
      expect(mockBooking.save).toHaveBeenCalled();
    });

    it('should throw 404 if court not found', async () => {
      Court.findById.mockResolvedValue(null);

      await expect(
        bookingService.createBooking('user1', { courtId: 'nonexistent', startDate: '2026-05-01', durationHours: 2, customerName: 'Test', customerPhone: '0901234567' })
      ).rejects.toThrow('Court not found');
    });
  });

  describe('getCustomerBookings', () => {
    it('should return customer bookings', async () => {
      const mockBookings = [{ _id: 'b1' }, { _id: 'b2' }];
      Booking.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockBookings),
        }),
      });

      const result = await bookingService.getCustomerBookings('user1', {});
      expect(result).toEqual(mockBookings);
    });

    it('should apply status filter', async () => {
      Booking.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([]),
        }),
      });

      await bookingService.getCustomerBookings('user1', { status: 'CONFIRMED' });

      expect(Booking.find).toHaveBeenCalledWith(
        expect.objectContaining({ customerId: 'user1', status: 'CONFIRMED' })
      );
    });
  });

  describe('getBookingById', () => {
    it('should return booking details', async () => {
      const mockBooking = {
        _id: 'b1',
        customerId: { _id: { toString: () => 'user1' } },
        adminId: { toString: () => 'admin1' },
      };
      Booking.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockBooking),
        }),
      });

      const result = await bookingService.getBookingById('b1', 'user1', 'customer');
      expect(result).toEqual(mockBooking);
    });

    it('should throw 404 if booking not found', async () => {
      Booking.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(
        bookingService.getBookingById('nonexistent', 'user1', 'customer')
      ).rejects.toThrow('Booking not found');
    });

    it('should throw 403 if not authorized', async () => {
      const mockBooking = {
        _id: 'b1',
        customerId: { _id: { toString: () => 'user1' } },
        adminId: { toString: () => 'admin1' },
      };
      Booking.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockBooking),
        }),
      });

      await expect(
        bookingService.getBookingById('b1', 'otherUser', 'customer')
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('addDrinkToBooking', () => {
    it('should add drink to booking successfully', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        drinkItems: [],
        totalDrinkPrice: 0,
        courtPrice: 200000,
        totalPrice: 200000,
        save: jest.fn().mockResolvedValue(true),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const mockDrink = {
        _id: 'drink1',
        name: 'Coca Cola',
        price: 15000,
        quantity: 50,
        save: jest.fn().mockResolvedValue(true),
      };
      Drink.findById.mockResolvedValue(mockDrink);

      const result = await bookingService.addDrinkToBooking('b1', 'admin1', 'owner', {
        drinkId: 'drink1',
        quantity: 2,
      });

      expect(result.message).toBe('Drink added to booking');
      expect(mockDrink.quantity).toBe(48);
      expect(mockBooking.totalDrinkPrice).toBe(30000);
    });

    it('should throw 400 if insufficient stock', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        save: jest.fn(),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const mockDrink = {
        _id: 'drink1',
        price: 15000,
        quantity: 1,
      };
      Drink.findById.mockResolvedValue(mockDrink);

      await expect(
        bookingService.addDrinkToBooking('b1', 'admin1', 'owner', { drinkId: 'drink1', quantity: 5 })
      ).rejects.toThrow('Insufficient stock');
    });

    it('should throw 404 if drink not found', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
      };
      Booking.findById.mockResolvedValue(mockBooking);
      Drink.findById.mockResolvedValue(null);

      await expect(
        bookingService.addDrinkToBooking('b1', 'admin1', 'owner', { drinkId: 'nonexistent', quantity: 1 })
      ).rejects.toThrow('Drink not found');
    });
  });

  describe('completeBooking', () => {
    it('should complete booking and create revenue', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        courtId: 'court1',
        courtPrice: 200000,
        totalDrinkPrice: 30000,
        totalPrice: 230000,
        save: jest.fn().mockResolvedValue(true),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const mockRevenue = { save: jest.fn().mockResolvedValue(true) };
      Revenue.mockImplementation(() => mockRevenue);

      const result = await bookingService.completeBooking('b1', 'admin1', 'owner');

      expect(result.message).toBe('Booking completed');
      expect(mockBooking.status).toBe('COMPLETED');
      expect(mockRevenue.save).toHaveBeenCalled();
    });

    it('should throw 404 if booking not found', async () => {
      Booking.findById.mockResolvedValue(null);

      await expect(
        bookingService.completeBooking('nonexistent', 'admin1', 'owner')
      ).rejects.toThrow('Booking not found');
    });

    it('should throw 403 if not authorized', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
      };
      Booking.findById.mockResolvedValue(mockBooking);

      await expect(
        bookingService.completeBooking('b1', 'otherUser', 'owner')
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('getAdminBookings', () => {
    it('should return all bookings for admin role', async () => {
      const mockBookings = [{ _id: 'b1' }];
      Booking.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockBookings),
          }),
        }),
      });

      const result = await bookingService.getAdminBookings('anyId', 'admin1', 'admin', {});
      expect(result).toEqual(mockBookings);
    });

    it('should throw 403 if owner tries to view other owner bookings', async () => {
      await expect(
        bookingService.getAdminBookings('owner1', 'owner2', 'owner', {})
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking and restore drink stock', async () => {
      const mockBooking = {
        _id: 'b1',
        customerId: { toString: () => 'user1' },
        adminId: { toString: () => 'admin1' },
        drinkItems: [
          { drinkId: 'drink1', quantity: 2 },
        ],
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const mockDrink = {
        _id: 'drink1',
        quantity: 10,
        save: jest.fn().mockResolvedValue(true),
      };
      Drink.findById.mockResolvedValue(mockDrink);
      Booking.findByIdAndDelete.mockResolvedValue(true);

      const result = await bookingService.deleteBooking('b1', 'user1', 'customer');

      expect(result.message).toBe('Booking deleted successfully');
      expect(mockDrink.quantity).toBe(12);
    });

    it('should throw 403 if not authorized', async () => {
      const mockBooking = {
        _id: 'b1',
        customerId: { toString: () => 'user1' },
        adminId: { toString: () => 'admin1' },
      };
      Booking.findById.mockResolvedValue(mockBooking);

      await expect(
        bookingService.deleteBooking('b1', 'stranger', 'customer')
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('approveBooking', () => {
    it('should approve booking successfully', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        status: 'PENDING_APPROVAL',
        save: jest.fn().mockResolvedValue(true),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const result = await bookingService.approveBooking('b1', 'admin1', 'owner');

      expect(result.message).toBe('Booking approved successfully');
      expect(mockBooking.status).toBe('CONFIRMED');
    });

    it('should throw error if booking is not in PENDING_APPROVAL status', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        status: 'CONFIRMED',
      };
      Booking.findById.mockResolvedValue(mockBooking);

      await expect(
        bookingService.approveBooking('b1', 'admin1', 'owner')
      ).rejects.toThrow('Booking cannot be approved in current status');
    });
  });

  describe('rejectBooking', () => {
    it('should reject booking and restore drink stock', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        status: 'PENDING_APPROVAL',
        drinkItems: [
          { drinkId: 'drink1', quantity: 3 },
        ],
        save: jest.fn().mockResolvedValue(true),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const mockDrink = {
        _id: 'drink1',
        quantity: 10,
        save: jest.fn().mockResolvedValue(true),
      };
      Drink.findById.mockResolvedValue(mockDrink);

      const result = await bookingService.rejectBooking('b1', 'admin1', 'owner');

      expect(result.message).toBe('Booking rejected successfully');
      expect(mockBooking.status).toBe('CANCELLED');
      expect(mockDrink.quantity).toBe(13);
    });

    it('should throw error if booking is not in PENDING_APPROVAL status', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        status: 'COMPLETED',
      };
      Booking.findById.mockResolvedValue(mockBooking);

      await expect(
        bookingService.rejectBooking('b1', 'admin1', 'owner')
      ).rejects.toThrow('Booking cannot be rejected in current status');
    });
  });

  describe('getCourtSchedule', () => {
    it('should return schedule for a given date', async () => {
      const mockBookings = [
        { startTime: '08:00', endTime: '10:00', status: 'CONFIRMED', courtNumber: 0 },
      ];
      Booking.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockBookings),
      });

      const result = await bookingService.getCourtSchedule('court1', '2026-05-01');
      expect(result).toEqual(mockBookings);
    });

    it('should throw error if date is not provided', async () => {
      await expect(
        bookingService.getCourtSchedule('court1', undefined)
      ).rejects.toThrow('Date query parameter is required');
    });
  });

  describe('updateBooking', () => {
    it('should update booking successfully', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        courtId: { toString: () => 'court1' },
        status: 'CONFIRMED',
        courtPrice: 200000,
        totalDrinkPrice: 0,
        totalPrice: 200000,
        durationHours: 2,
        drinkItems: [],
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true),
      };
      Booking.findById.mockResolvedValue(mockBooking);

      const result = await bookingService.updateBooking('b1', 'admin1', 'owner', {
        notes: 'Test note',
      });

      expect(result.message).toBe('Booking updated successfully');
      expect(mockBooking.notes).toBe('Test note');
    });

    it('should throw error if booking status is not CONFIRMED or PLAYING', async () => {
      const mockBooking = {
        _id: 'b1',
        adminId: { toString: () => 'admin1' },
        status: 'PENDING_APPROVAL',
      };
      Booking.findById.mockResolvedValue(mockBooking);

      await expect(
        bookingService.updateBooking('b1', 'admin1', 'owner', {})
      ).rejects.toThrow();
    });
  });
});
