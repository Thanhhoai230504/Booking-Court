const courtService = require('../src/services/courtService');
const Court = require('../src/models/Court');
const { deleteFile } = require('../src/middleware/upload');

// Mock các module phụ thuộc
jest.mock('../src/models/Court');
jest.mock('../src/middleware/upload', () => ({
  deleteFile: jest.fn(),
}));

// ===================================
// Helper: tạo mock ObjectId
// ===================================
const mockObjectId = (id = 'court123') => id;
const mockUserId = 'user123';
const mockAdminId = 'admin123';

// ===================================
// Reset mocks trước mỗi test
// ===================================
beforeEach(() => {
  jest.clearAllMocks();
});

// =====================================================================
// TEST SUITE: getAvailableCourts
// =====================================================================
describe('courtService.getAvailableCourts', () => {
  const mockCourts = [
    { _id: 'c1', name: 'Court A', status: 'active', city: 'HCM', pricePerHour: 100000 },
    { _id: 'c2', name: 'Court B', status: 'active', city: 'HN', pricePerHour: 150000 },
  ];

  test('should return all active courts when no filters', async () => {
    Court.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockCourts),
    });

    const result = await courtService.getAvailableCourts({});

    expect(Court.find).toHaveBeenCalledWith({ status: 'active' });
    expect(result).toEqual(mockCourts);
  });

  test('should filter by city', async () => {
    Court.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([mockCourts[0]]),
    });

    const result = await courtService.getAvailableCourts({ city: 'HCM' });

    expect(Court.find).toHaveBeenCalledWith({ status: 'active', city: 'HCM' });
    expect(result).toHaveLength(1);
  });

  test('should filter by maxPrice', async () => {
    Court.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([mockCourts[0]]),
    });

    const result = await courtService.getAvailableCourts({ maxPrice: 120000 });

    expect(Court.find).toHaveBeenCalledWith({
      status: 'active',
      pricePerHour: { $lte: 120000 },
    });
  });

  test('should filter by both city and maxPrice', async () => {
    Court.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([mockCourts[0]]),
    });

    await courtService.getAvailableCourts({ city: 'HCM', maxPrice: 120000 });

    expect(Court.find).toHaveBeenCalledWith({
      status: 'active',
      city: 'HCM',
      pricePerHour: { $lte: 120000 },
    });
  });
});

// =====================================================================
// TEST SUITE: getCourtById
// =====================================================================
describe('courtService.getCourtById', () => {
  test('should return court when found', async () => {
    const mockCourt = { _id: 'c1', name: 'Court A' };
    Court.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCourt),
    });

    const result = await courtService.getCourtById('c1');

    expect(Court.findById).toHaveBeenCalledWith('c1');
    expect(result).toEqual(mockCourt);
  });

  test('should throw 404 when court not found', async () => {
    Court.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await expect(courtService.getCourtById('nonexistent'))
      .rejects
      .toThrow('Court not found');

    try {
      await courtService.getCourtById('nonexistent');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });
});

// =====================================================================
// TEST SUITE: createCourt
// =====================================================================
describe('courtService.createCourt', () => {
  const courtData = {
    name: 'New Court',
    address: '123 Street',
    city: 'HCM',
    description: 'Nice court',
    totalCourts: 3,
    pricePerHour: 100000,
    hourlyPricing: [{ hour: '06:00', price: 80000 }],
    openingHours: { start: '06:00', end: '22:00' },
  };

  test('should create court successfully with all fields', async () => {
    const savedCourt = { ...courtData, _id: 'c1', adminId: mockUserId };
    Court.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedCourt),
      ...savedCourt,
    }));

    const result = await courtService.createCourt(mockUserId, courtData, ['/uploads/courts/img.jpg']);

    expect(Court).toHaveBeenCalledWith({
      name: 'New Court',
      address: '123 Street',
      city: 'HCM',
      images: ['/uploads/courts/img.jpg'],
      description: 'Nice court',
      totalCourts: 3,
      pricePerHour: 100000,
      hourlyPricing: [{ hour: '06:00', price: 80000 }],
      openingHours: { start: '06:00', end: '22:00' },
      adminId: mockUserId,
    });
    expect(result.message).toBe('Court created successfully');
  });

  test('should create court with default values when optional fields missing', async () => {
    const minimalData = {
      name: 'Minimal Court',
      address: '456 Ave',
      pricePerHour: 50000,
    };

    Court.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    await courtService.createCourt(mockUserId, minimalData);

    expect(Court).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Minimal Court',
        address: '456 Ave',
        pricePerHour: 50000,
        totalCourts: 1,
        hourlyPricing: [],
        openingHours: { start: '06:00', end: '22:00' },
        images: [],
        adminId: mockUserId,
      }),
    );
  });
});

// =====================================================================
// TEST SUITE: updateCourt
// =====================================================================
describe('courtService.updateCourt', () => {
  const existingCourt = {
    _id: 'c1',
    name: 'Old Court',
    address: 'Old Address',
    adminId: { toString: () => mockUserId },
    images: ['/uploads/courts/old.jpg'],
    save: jest.fn().mockResolvedValue(true),
  };

  test('should update court successfully by owner', async () => {
    Court.findById.mockResolvedValue({ ...existingCourt, save: jest.fn().mockResolvedValue(true) });

    const result = await courtService.updateCourt('c1', mockUserId, 'owner', { name: 'Updated Court' });

    expect(result.message).toBe('Court updated successfully');
  });

  test('should update court by admin role regardless of ownership', async () => {
    Court.findById.mockResolvedValue({ ...existingCourt, save: jest.fn().mockResolvedValue(true) });

    const result = await courtService.updateCourt('c1', 'otherUser', 'admin', { name: 'Admin Updated' });

    expect(result.message).toBe('Court updated successfully');
  });

  test('should throw 404 when court not found', async () => {
    Court.findById.mockResolvedValue(null);

    await expect(courtService.updateCourt('nonexistent', mockUserId, 'owner', {}))
      .rejects
      .toThrow('Court not found');
  });

  test('should throw 403 when non-owner non-admin tries to update', async () => {
    Court.findById.mockResolvedValue({ ...existingCourt });

    try {
      await courtService.updateCourt('c1', 'otherUser', 'owner', { name: 'Hack' });
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should replace old images when new images uploaded', async () => {
    const courtWithImages = {
      ...existingCourt,
      images: ['/uploads/courts/old1.jpg', '/uploads/courts/old2.jpg'],
      save: jest.fn().mockResolvedValue(true),
    };
    Court.findById.mockResolvedValue(courtWithImages);

    await courtService.updateCourt('c1', mockUserId, 'owner', {}, ['/uploads/courts/new.jpg']);

    // Kiểm tra xóa ảnh cũ
    expect(deleteFile).toHaveBeenCalledTimes(2);
    // Kiểm tra cập nhật ảnh mới
    expect(courtWithImages.images).toEqual(['/uploads/courts/new.jpg']);
  });
});

// =====================================================================
// TEST SUITE: getAdminCourts
// =====================================================================
describe('courtService.getAdminCourts', () => {
  test('should return all courts for admin role', async () => {
    const allCourts = [{ _id: 'c1' }, { _id: 'c2' }];
    Court.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(allCourts),
    });

    const result = await courtService.getAdminCourts(mockAdminId, mockUserId, 'admin');

    expect(Court.find).toHaveBeenCalledWith();
    expect(result).toEqual(allCourts);
  });

  test('should return own courts for owner role', async () => {
    const ownCourts = [{ _id: 'c1' }];
    Court.find.mockResolvedValue(ownCourts);

    const result = await courtService.getAdminCourts(mockUserId, mockUserId, 'owner');

    expect(Court.find).toHaveBeenCalledWith({ adminId: mockUserId });
    expect(result).toEqual(ownCourts);
  });

  test('should throw 403 when owner tries to view other admin courts', async () => {
    try {
      await courtService.getAdminCourts('otherAdmin', mockUserId, 'owner');
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });
});

// =====================================================================
// TEST SUITE: deleteCourt
// =====================================================================
describe('courtService.deleteCourt', () => {
  const mockCourt = {
    _id: 'c1',
    adminId: { toString: () => mockUserId },
    images: ['/uploads/courts/img1.jpg', '/uploads/courts/img2.jpg'],
  };

  test('should delete court successfully by owner', async () => {
    Court.findById.mockResolvedValue(mockCourt);
    Court.findByIdAndDelete.mockResolvedValue(true);

    const result = await courtService.deleteCourt('c1', mockUserId, 'owner');

    expect(result.message).toBe('Court deleted successfully');
    expect(Court.findByIdAndDelete).toHaveBeenCalledWith('c1');
    // Kiểm tra xóa ảnh trên disk
    expect(deleteFile).toHaveBeenCalledTimes(2);
  });

  test('should delete court by admin regardless of ownership', async () => {
    Court.findById.mockResolvedValue(mockCourt);
    Court.findByIdAndDelete.mockResolvedValue(true);

    const result = await courtService.deleteCourt('c1', 'otherUser', 'admin');

    expect(result.message).toBe('Court deleted successfully');
  });

  test('should throw 404 when court not found', async () => {
    Court.findById.mockResolvedValue(null);

    await expect(courtService.deleteCourt('nonexistent', mockUserId, 'owner'))
      .rejects
      .toThrow('Court not found');
  });

  test('should throw 403 when non-owner non-admin tries to delete', async () => {
    Court.findById.mockResolvedValue(mockCourt);

    try {
      await courtService.deleteCourt('c1', 'otherUser', 'owner');
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should handle court with no images gracefully', async () => {
    const courtNoImages = { ...mockCourt, images: [] };
    Court.findById.mockResolvedValue(courtNoImages);
    Court.findByIdAndDelete.mockResolvedValue(true);

    const result = await courtService.deleteCourt('c1', mockUserId, 'owner');

    expect(deleteFile).not.toHaveBeenCalled();
    expect(result.message).toBe('Court deleted successfully');
  });
});
