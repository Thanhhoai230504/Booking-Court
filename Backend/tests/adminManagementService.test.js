const User = require('../../src/models/User');
const Court = require('../../src/models/Court');
const Revenue = require('../../src/models/Revenue');
const Booking = require('../../src/models/Booking');
const adminManagementService = require('../../src/services/adminManagementService');

jest.mock('../../src/models/User');
jest.mock('../../src/models/Court');
jest.mock('../../src/models/Revenue');
jest.mock('../../src/models/Booking');

describe('AdminManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOwner', () => {
    it('should create owner successfully', async () => {
      User.findOne.mockResolvedValue(null);

      const mockUser = {
        _id: 'owner1',
        name: 'Owner Test',
        email: 'owner@test.com',
        role: 'owner',
        save: jest.fn().mockResolvedValue(true),
      };
      User.mockImplementation(() => mockUser);

      const result = await adminManagementService.createOwner({
        name: 'Owner Test',
        email: 'owner@test.com',
        phone: '0901234567',
        password: 'password123',
      });

      expect(result.message).toBe('Tạo chủ sân thành công');
      expect(result.user.role).toBe('owner');
    });

    it('should throw error if email already exists', async () => {
      User.findOne.mockResolvedValue({ _id: 'existing' });

      await expect(
        adminManagementService.createOwner({
          name: 'Test',
          email: 'existing@test.com',
          phone: '0901234567',
          password: 'password123',
        })
      ).rejects.toThrow('Email đã tồn tại');
    });
  });

  describe('getAllOwners', () => {
    it('should return all owners with stats', async () => {
      const mockOwners = [
        {
          _id: 'owner1',
          name: 'Owner 1',
          role: 'owner',
          toObject: () => ({ _id: 'owner1', name: 'Owner 1', role: 'owner' }),
        },
      ];
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOwners),
      });

      Court.countDocuments.mockResolvedValue(3);
      Revenue.aggregate.mockResolvedValue([{ total: 500000 }]);

      const result = await adminManagementService.getAllOwners();

      expect(result).toHaveLength(1);
      expect(result[0].courtCount).toBe(3);
      expect(result[0].totalRevenue).toBe(500000);
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers with booking count', async () => {
      const mockCustomers = [
        {
          _id: 'cust1',
          name: 'Customer 1',
          role: 'customer',
          toObject: () => ({ _id: 'cust1', name: 'Customer 1', role: 'customer' }),
        },
      ];
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCustomers),
      });

      Booking.countDocuments.mockResolvedValue(5);

      const result = await adminManagementService.getAllCustomers();

      expect(result).toHaveLength(1);
      expect(result[0].bookingCount).toBe(5);
    });
  });

  describe('getOwnerById', () => {
    it('should return owner details with courts and stats', async () => {
      const mockOwner = {
        _id: 'owner1',
        name: 'Owner 1',
        role: 'owner',
        toObject: () => ({ _id: 'owner1', name: 'Owner 1', role: 'owner' }),
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOwner),
      });

      Court.find.mockResolvedValue([{ _id: 'court1' }]);
      Revenue.aggregate.mockResolvedValue([{ total: 1000000 }]);
      Booking.countDocuments.mockResolvedValue(10);

      const result = await adminManagementService.getOwnerById('owner1');

      expect(result.courts).toHaveLength(1);
      expect(result.totalRevenue).toBe(1000000);
      expect(result.bookingCount).toBe(10);
    });

    it('should throw 404 if owner not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        adminManagementService.getOwnerById('nonexistent')
      ).rejects.toThrow('Owner not found');
    });

    it('should throw 404 if user is not an owner', async () => {
      const mockUser = {
        _id: 'user1',
        role: 'customer',
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(
        adminManagementService.getOwnerById('user1')
      ).rejects.toThrow('Owner not found');
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle user status', async () => {
      const mockUser = {
        _id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer',
        isActive: true,
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      const result = await adminManagementService.toggleUserStatus('user1');

      expect(result.user.isActive).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        adminManagementService.toggleUserStatus('nonexistent')
      ).rejects.toThrow('User not found');
    });

    it('should throw 403 when trying to modify admin', async () => {
      const mockUser = {
        _id: 'admin1',
        role: 'admin',
      };
      User.findById.mockResolvedValue(mockUser);

      await expect(
        adminManagementService.toggleUserStatus('admin1')
      ).rejects.toThrow('Cannot modify admin account');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = {
        _id: 'user1',
        role: 'customer',
      };
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndDelete.mockResolvedValue(true);

      const result = await adminManagementService.deleteUser('user1');

      expect(result.message).toBe('User deleted successfully');
    });

    it('should throw 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        adminManagementService.deleteUser('nonexistent')
      ).rejects.toThrow('User not found');
    });

    it('should throw 403 when trying to delete admin', async () => {
      const mockUser = {
        _id: 'admin1',
        role: 'admin',
      };
      User.findById.mockResolvedValue(mockUser);

      await expect(
        adminManagementService.deleteUser('admin1')
      ).rejects.toThrow('Cannot delete admin account');
    });
  });

  describe('getSystemDashboard', () => {
    it('should return system dashboard stats', async () => {
      User.countDocuments.mockImplementation((filter) => {
        if (filter.role === 'owner') return Promise.resolve(5);
        if (filter.role === 'customer') return Promise.resolve(100);
        return Promise.resolve(0);
      });

      Court.countDocuments.mockResolvedValue(20);
      Booking.countDocuments.mockResolvedValue(500);

      Revenue.aggregate.mockResolvedValueOnce([{
        totalRevenue: 50000000,
        courtRevenue: 40000000,
        drinkRevenue: 10000000,
      }]);

      Revenue.aggregate.mockResolvedValueOnce([
        { _id: 'owner1', totalRevenue: 30000000, ownerDetails: { name: 'Owner 1' } },
      ]);

      const result = await adminManagementService.getSystemDashboard();

      expect(result.totalOwners).toBe(5);
      expect(result.totalCustomers).toBe(100);
      expect(result.totalCourts).toBe(20);
      expect(result.totalBookings).toBe(500);
      expect(result.totalRevenue).toBe(50000000);
    });
  });
});
