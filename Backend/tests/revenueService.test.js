const Revenue = require('../../src/models/Revenue');
const revenueService = require('../../src/services/revenueService');

jest.mock('../../src/models/Revenue');

describe('RevenueService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should return dashboard data for admin', async () => {
      const mockRevenues = [
        { totalRevenue: 500000, courtRevenue: 400000, drinkRevenue: 100000 },
        { totalRevenue: 300000, courtRevenue: 250000, drinkRevenue: 50000 },
      ];
      Revenue.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockRevenues),
        }),
      });

      const result = await revenueService.getDashboard('anyId', 'admin1', 'admin', {});

      expect(result.totalRevenue).toBe(800000);
      expect(result.courtRevenue).toBe(650000);
      expect(result.drinkRevenue).toBe(150000);
      expect(result.transactionCount).toBe(2);
    });

    it('should throw 403 if owner tries to view other owner revenue', async () => {
      await expect(
        revenueService.getDashboard('owner1', 'owner2', 'owner', {})
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('getRevenueByDate', () => {
    it('should return revenue grouped by date', async () => {
      const mockResult = [
        { _id: '2026-05-01', totalRevenue: 500000 },
      ];
      Revenue.aggregate.mockResolvedValue(mockResult);

      const result = await revenueService.getRevenueByDate('admin1', 'admin1', 'admin', {});
      expect(result).toEqual(mockResult);
    });

    it('should throw 403 if not authorized', async () => {
      await expect(
        revenueService.getRevenueByDate('owner1', 'owner2', 'owner', {})
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('getRevenueByMonth', () => {
    it('should return revenue grouped by month', async () => {
      const mockResult = [
        { _id: '2026-05', totalRevenue: 1500000 },
      ];
      Revenue.aggregate.mockResolvedValue(mockResult);

      const result = await revenueService.getRevenueByMonth('admin1', 'admin1', 'admin', {});
      expect(result).toEqual(mockResult);
    });

    it('should filter by year', async () => {
      Revenue.aggregate.mockResolvedValue([]);

      await revenueService.getRevenueByMonth('admin1', 'admin1', 'admin', { year: '2026' });

      expect(Revenue.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              date: expect.any(Object),
            }),
          }),
        ])
      );
    });
  });

  describe('getRevenueByCourt', () => {
    it('should return revenue grouped by court', async () => {
      const mockResult = [
        { _id: 'court1', totalRevenue: 1000000, courtDetails: { name: 'Court A' } },
      ];
      Revenue.aggregate.mockResolvedValue(mockResult);

      const result = await revenueService.getRevenueByCourt('admin1', 'admin1', 'admin', {});
      expect(result).toEqual(mockResult);
    });

    it('should throw 403 if not authorized', async () => {
      await expect(
        revenueService.getRevenueByCourt('owner1', 'owner2', 'owner', {})
      ).rejects.toThrow('Not authorized');
    });
  });
});
