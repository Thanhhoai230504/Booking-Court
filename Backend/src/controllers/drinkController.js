const drinkService = require('../services/drinkService');

const createDrink = async (req, res) => {
  try {
    // Lấy path từ multer uploaded file
    const imagePath = req.file ? `/uploads/drinks/${req.file.filename}` : '';
    const result = await drinkService.createDrink(req.userId, req.body, imagePath);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getAdminDrinks = async (req, res) => {
  try {
    const result = await drinkService.getAdminDrinks(req.params.adminId, req.userId, req.userRole);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const updateDrink = async (req, res) => {
  try {
    // Lấy path từ multer uploaded file (nếu có)
    const imagePath = req.file ? `/uploads/drinks/${req.file.filename}` : null;
    const result = await drinkService.updateDrink(req.params.id, req.userId, req.userRole, req.body, imagePath);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const result = await drinkService.updateStock(req.params.id, req.userId, req.userRole, req.body.quantity);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const deleteDrink = async (req, res) => {
  try {
    const result = await drinkService.deleteDrink(req.params.id, req.userId, req.userRole);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = {
  createDrink,
  getAdminDrinks,
  updateDrink,
  updateStock,
  deleteDrink,
};
