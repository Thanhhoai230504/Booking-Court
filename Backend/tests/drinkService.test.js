const drinkService = require('../src/services/drinkService');
const Drink = require('../src/models/Drink');
const { deleteFile } = require('../src/middleware/upload');

// Mock các module phụ thuộc
jest.mock('../src/models/Drink');
jest.mock('../src/middleware/upload', () => ({
  deleteFile: jest.fn(),
}));

// ===================================
// Helper constants
// ===================================
const mockUserId = 'user123';
const mockAdminId = 'admin123';

// ===================================
// Reset mocks trước mỗi test
// ===================================
beforeEach(() => {
  jest.clearAllMocks();
});

// =====================================================================
// TEST SUITE: createDrink
// =====================================================================
describe('drinkService.createDrink', () => {
  const drinkData = {
    name: 'Coca Cola',
    price: 15000,
    quantity: 100,
    minStock: 20,
    description: 'Nước ngọt có gas',
  };

  test('should create drink successfully with all fields', async () => {
    const savedDrink = { ...drinkData, _id: 'd1', adminId: mockUserId, image: '/uploads/drinks/coca.jpg' };
    Drink.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedDrink),
      ...savedDrink,
    }));

    const result = await drinkService.createDrink(mockUserId, drinkData, '/uploads/drinks/coca.jpg');

    expect(Drink).toHaveBeenCalledWith({
      name: 'Coca Cola',
      price: 15000,
      quantity: 100,
      minStock: 20,
      description: 'Nước ngọt có gas',
      image: '/uploads/drinks/coca.jpg',
      adminId: mockUserId,
    });
    expect(result.message).toBe('Drink created successfully');
  });

  test('should create drink with default values when optional fields missing', async () => {
    const minimalData = {
      name: 'Water',
      price: 5000,
    };

    Drink.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    await drinkService.createDrink(mockUserId, minimalData);

    expect(Drink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Water',
        price: 5000,
        quantity: 0,
        minStock: 10,
        image: '',
        adminId: mockUserId,
      }),
    );
  });

  test('should create drink without image', async () => {
    Drink.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    await drinkService.createDrink(mockUserId, drinkData);

    expect(Drink).toHaveBeenCalledWith(
      expect.objectContaining({
        image: '',
      }),
    );
  });
});

// =====================================================================
// TEST SUITE: getAdminDrinks
// =====================================================================
describe('drinkService.getAdminDrinks', () => {
  const mockDrinks = [
    { _id: 'd1', name: 'Coca', quantity: 5, minStock: 10 },
    { _id: 'd2', name: 'Pepsi', quantity: 50, minStock: 10 },
    { _id: 'd3', name: 'Water', quantity: 10, minStock: 10 },
  ];

  test('should return all drinks with low stock alert for admin role', async () => {
    Drink.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockDrinks),
    });

    const result = await drinkService.getAdminDrinks(mockAdminId, mockUserId, 'admin');

    expect(Drink.find).toHaveBeenCalledWith();
    expect(result.drinks).toEqual(mockDrinks);
    expect(result.lowStockAlert).toBe(true);
    // Coca (5 <= 10) and Water (10 <= 10) are low stock
    expect(result.lowStockItems).toHaveLength(2);
  });

  test('should return own drinks for owner role', async () => {
    Drink.find.mockResolvedValue(mockDrinks);

    const result = await drinkService.getAdminDrinks(mockUserId, mockUserId, 'owner');

    expect(Drink.find).toHaveBeenCalledWith({ adminId: mockUserId });
    expect(result.drinks).toEqual(mockDrinks);
  });

  test('should throw 403 when owner tries to view other admin drinks', async () => {
    try {
      await drinkService.getAdminDrinks('otherAdmin', mockUserId, 'owner');
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should return lowStockAlert false when all drinks have enough stock', async () => {
    const healthyDrinks = [
      { _id: 'd1', name: 'Coca', quantity: 50, minStock: 10 },
      { _id: 'd2', name: 'Pepsi', quantity: 30, minStock: 10 },
    ];
    Drink.find.mockResolvedValue(healthyDrinks);

    const result = await drinkService.getAdminDrinks(mockUserId, mockUserId, 'owner');

    expect(result.lowStockAlert).toBe(false);
    expect(result.lowStockItems).toHaveLength(0);
  });
});

// =====================================================================
// TEST SUITE: updateDrink
// =====================================================================
describe('drinkService.updateDrink', () => {
  const existingDrink = {
    _id: 'd1',
    name: 'Old Drink',
    price: 10000,
    adminId: { toString: () => mockUserId },
    image: '/uploads/drinks/old.jpg',
    save: jest.fn().mockResolvedValue(true),
  };

  test('should update drink successfully by owner', async () => {
    Drink.findById.mockResolvedValue({ ...existingDrink, save: jest.fn().mockResolvedValue(true) });

    const result = await drinkService.updateDrink('d1', mockUserId, 'owner', { name: 'Updated Drink' });

    expect(result.message).toBe('Drink updated successfully');
  });

  test('should update drink by admin role regardless of ownership', async () => {
    Drink.findById.mockResolvedValue({ ...existingDrink, save: jest.fn().mockResolvedValue(true) });

    const result = await drinkService.updateDrink('d1', 'otherUser', 'admin', { price: 20000 });

    expect(result.message).toBe('Drink updated successfully');
  });

  test('should throw 404 when drink not found', async () => {
    Drink.findById.mockResolvedValue(null);

    await expect(drinkService.updateDrink('nonexistent', mockUserId, 'owner', {}))
      .rejects
      .toThrow('Drink not found');
  });

  test('should throw 403 when non-owner non-admin tries to update', async () => {
    Drink.findById.mockResolvedValue({ ...existingDrink });

    try {
      await drinkService.updateDrink('d1', 'otherUser', 'owner', { name: 'Hack' });
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should replace old image when new image uploaded', async () => {
    const drinkWithImage = {
      ...existingDrink,
      image: '/uploads/drinks/old.jpg',
      save: jest.fn().mockResolvedValue(true),
    };
    Drink.findById.mockResolvedValue(drinkWithImage);

    await drinkService.updateDrink('d1', mockUserId, 'owner', {}, '/uploads/drinks/new.jpg');

    expect(deleteFile).toHaveBeenCalledTimes(1);
    expect(drinkWithImage.image).toBe('/uploads/drinks/new.jpg');
  });

  test('should only update allowed fields', async () => {
    const drink = {
      ...existingDrink,
      save: jest.fn().mockResolvedValue(true),
    };
    Drink.findById.mockResolvedValue(drink);

    await drinkService.updateDrink('d1', mockUserId, 'owner', {
      name: 'New Name',
      price: 25000,
      quantity: 200,
      minStock: 15,
      description: 'Updated desc',
      adminId: 'hackedId', // Field này không thuộc allowedFields
    });

    expect(drink.name).toBe('New Name');
    expect(drink.price).toBe(25000);
    // adminId không nên bị thay đổi
    expect(drink.adminId).not.toBe('hackedId');
  });
});

// =====================================================================
// TEST SUITE: updateStock
// =====================================================================
describe('drinkService.updateStock', () => {
  const existingDrink = {
    _id: 'd1',
    name: 'Coca',
    quantity: 50,
    adminId: { toString: () => mockUserId },
    save: jest.fn().mockResolvedValue(true),
  };

  test('should add stock successfully', async () => {
    const drink = { ...existingDrink, save: jest.fn().mockResolvedValue(true) };
    Drink.findById.mockResolvedValue(drink);

    const result = await drinkService.updateStock('d1', mockUserId, 'owner', 30);

    expect(drink.quantity).toBe(80); // 50 + 30
    expect(result.message).toBe('Stock updated');
  });

  test('should reduce stock with negative quantity', async () => {
    const drink = { ...existingDrink, quantity: 50, save: jest.fn().mockResolvedValue(true) };
    Drink.findById.mockResolvedValue(drink);

    const result = await drinkService.updateStock('d1', mockUserId, 'owner', -20);

    expect(drink.quantity).toBe(30); // 50 - 20
    expect(result.message).toBe('Stock updated');
  });

  test('should throw 404 when drink not found', async () => {
    Drink.findById.mockResolvedValue(null);

    await expect(drinkService.updateStock('nonexistent', mockUserId, 'owner', 10))
      .rejects
      .toThrow('Drink not found');
  });

  test('should throw 403 when non-owner non-admin tries to update stock', async () => {
    Drink.findById.mockResolvedValue(existingDrink);

    try {
      await drinkService.updateStock('d1', 'otherUser', 'owner', 10);
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should allow admin to update stock regardless of ownership', async () => {
    const drink = { ...existingDrink, save: jest.fn().mockResolvedValue(true) };
    Drink.findById.mockResolvedValue(drink);

    const result = await drinkService.updateStock('d1', 'otherUser', 'admin', 50);

    expect(drink.quantity).toBe(100);
    expect(result.message).toBe('Stock updated');
  });
});

// =====================================================================
// TEST SUITE: deleteDrink
// =====================================================================
describe('drinkService.deleteDrink', () => {
  const mockDrink = {
    _id: 'd1',
    adminId: { toString: () => mockUserId },
    image: '/uploads/drinks/coca.jpg',
  };

  test('should delete drink successfully by owner', async () => {
    Drink.findById.mockResolvedValue(mockDrink);
    Drink.findByIdAndDelete.mockResolvedValue(true);

    const result = await drinkService.deleteDrink('d1', mockUserId, 'owner');

    expect(result.message).toBe('Drink deleted successfully');
    expect(Drink.findByIdAndDelete).toHaveBeenCalledWith('d1');
    expect(deleteFile).toHaveBeenCalledTimes(1);
  });

  test('should delete drink by admin regardless of ownership', async () => {
    Drink.findById.mockResolvedValue(mockDrink);
    Drink.findByIdAndDelete.mockResolvedValue(true);

    const result = await drinkService.deleteDrink('d1', 'otherUser', 'admin');

    expect(result.message).toBe('Drink deleted successfully');
  });

  test('should throw 404 when drink not found', async () => {
    Drink.findById.mockResolvedValue(null);

    await expect(drinkService.deleteDrink('nonexistent', mockUserId, 'owner'))
      .rejects
      .toThrow('Drink not found');
  });

  test('should throw 403 when non-owner non-admin tries to delete', async () => {
    Drink.findById.mockResolvedValue(mockDrink);

    try {
      await drinkService.deleteDrink('d1', 'otherUser', 'owner');
    } catch (error) {
      expect(error.message).toBe('Not authorized');
      expect(error.status).toBe(403);
    }
  });

  test('should handle drink with no image gracefully', async () => {
    const drinkNoImage = { ...mockDrink, image: '' };
    Drink.findById.mockResolvedValue(drinkNoImage);
    Drink.findByIdAndDelete.mockResolvedValue(true);

    const result = await drinkService.deleteDrink('d1', mockUserId, 'owner');

    expect(deleteFile).not.toHaveBeenCalled();
    expect(result.message).toBe('Drink deleted successfully');
  });
});
