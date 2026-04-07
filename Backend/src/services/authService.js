const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { deleteFile } = require('../middleware/upload');
const path = require('path');

const registerUser = async (userData) => {
  const { name, email, phone, password, role = 'customer' } = userData;

  // Không cho phép đăng ký admin qua API
  if (role === 'admin') {
    const error = new Error('Cannot register as admin');
    error.status = 403;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  const user = new User({
    name,
    email,
    phone,
    password,
    role,
  });

  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
    },
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // Kiểm tra tài khoản có bị khoá không
  if (!user.isActive) {
    const error = new Error('Account has been deactivated');
    error.status = 403;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar || '',
    },
  };
};

const updateUserProfile = async (userId, updateData, avatarPath = null) => {
  const { name, phone } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  // Cập nhật avatar nếu có upload file mới
  if (avatarPath) {
    // Xóa avatar cũ trên disk
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', '..', user.avatar);
      deleteFile(oldPath);
    }
    user.avatar = avatarPath;
  }

  await user.save();

  return {
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar || '',
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
};
