const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    // Lấy avatar path từ multer uploaded file (nếu có)
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;
    const result = await authService.updateUserProfile(req.userId, req.body, avatarPath);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
};
