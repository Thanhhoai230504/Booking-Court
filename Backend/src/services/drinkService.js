const Drink = require('../models/Drink');
const { deleteFile } = require('../middleware/upload');
const path = require('path');

const createDrink = async (userId, drinkData, imagePath = '') => {
  const { name, price, quantity, minStock, description } = drinkData;

  const drink = new Drink({
    name,
    price,
    quantity: quantity || 0,
    minStock: minStock || 10,
    description,
    image: imagePath,
    adminId: userId,
  });

  await drink.save();

  return {
    message: 'Drink created successfully',
    drink,
  };
};

const getAdminDrinks = async (adminId, userId, userRole) => {
  // Admin xem tất cả đồ uống, owner chỉ xem của mình
  if (userRole === 'admin') {
    const drinks = await Drink.find().populate('adminId', 'name email');
    const lowStockDrinks = drinks.filter(d => d.quantity <= d.minStock);
    return {
      drinks,
      lowStockAlert: lowStockDrinks.length > 0,
      lowStockItems: lowStockDrinks,
    };
  }

  if (adminId !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const drinks = await Drink.find({ adminId: userId });

  const lowStockDrinks = drinks.filter(d => d.quantity <= d.minStock);

  return {
    drinks,
    lowStockAlert: lowStockDrinks.length > 0,
    lowStockItems: lowStockDrinks,
  };
};

const updateDrink = async (drinkId, userId, userRole, updateData, imagePath = null) => {
  const drink = await Drink.findById(drinkId);

  if (!drink) {
    const error = new Error('Drink not found');
    error.status = 404;
    throw error;
  }

  if (userRole !== 'admin' && drink.adminId.toString() !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const allowedFields = ['name', 'price', 'quantity', 'minStock', 'description'];
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      drink[field] = updateData[field];
    }
  }

  // Nếu có upload ảnh mới
  if (imagePath) {
    // Xóa ảnh cũ trên disk
    if (drink.image && drink.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', '..', drink.image);
      deleteFile(oldPath);
    }
    drink.image = imagePath;
  }

  await drink.save();

  return {
    message: 'Drink updated successfully',
    drink,
  };
};

const updateStock = async (drinkId, userId, userRole, quantity) => {
  const drink = await Drink.findById(drinkId);

  if (!drink) {
    const error = new Error('Drink not found');
    error.status = 404;
    throw error;
  }

  if (userRole !== 'admin' && drink.adminId.toString() !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  drink.quantity += quantity;
  await drink.save();

  return {
    message: 'Stock updated',
    drink,
  };
};

const deleteDrink = async (drinkId, userId, userRole) => {
  const drink = await Drink.findById(drinkId);

  if (!drink) {
    const error = new Error('Drink not found');
    error.status = 404;
    throw error;
  }

  if (userRole !== 'admin' && drink.adminId.toString() !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  // Xóa ảnh trên disk
  if (drink.image && drink.image.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', '..', drink.image);
    deleteFile(filePath);
  }

  await Drink.findByIdAndDelete(drinkId);

  return {
    message: 'Drink deleted successfully',
  };
};

module.exports = {
  createDrink,
  getAdminDrinks,
  updateDrink,
  updateStock,
  deleteDrink,
};
