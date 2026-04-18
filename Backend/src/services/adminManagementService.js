const User = require('../models/User');
const Court = require('../models/Court');
const Revenue = require('../models/Revenue');
const Booking = require('../models/Booking');

const createOwner = async (ownerData) => {
  const { name, email, phone, password } = ownerData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email đã tồn tại');
    error.status = 400;
    throw error;
  }

  const user = new User({
    name,
    email,
    phone,
    password,
    role: 'owner',
    isActive: true
  });

  await user.save();

  return {
    message: 'Tạo chủ sân thành công',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getAllOwners = async () => {
  const owners = await User.find({ role: 'owner' }).select('-password');
  
  // Thêm thông tin số sân cho mỗi owner
  const ownersWithStats = await Promise.all(
    owners.map(async (owner) => {
      const courtCount = await Court.countDocuments({ adminId: owner._id });
      const totalRevenue = await Revenue.aggregate([
        { $match: { adminId: owner._id } },
        { $group: { _id: null, total: { $sum: '$totalRevenue' } } },
      ]);
      return {
        ...owner.toObject(),
        courtCount,
        totalRevenue: totalRevenue[0]?.total || 0,
      };
    })
  );

  return ownersWithStats;
};

const getAllCustomers = async () => {
  const customers = await User.find({ role: 'customer' }).select('-password');
  
  // Thêm thông tin số booking cho mỗi customer
  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const bookingCount = await Booking.countDocuments({ customerId: customer._id });
      return {
        ...customer.toObject(),
        bookingCount,
      };
    })
  );

  return customersWithStats;
};

const getOwnerById = async (ownerId) => {
  const owner = await User.findById(ownerId).select('-password');
  if (!owner || owner.role !== 'owner') {
    const error = new Error('Owner not found');
    error.status = 404;
    throw error;
  }

  const courts = await Court.find({ adminId: ownerId });
  const totalRevenue = await Revenue.aggregate([
    { $match: { adminId: owner._id } },
    { $group: { _id: null, total: { $sum: '$totalRevenue' } } },
  ]);
  const bookingCount = await Booking.countDocuments({ adminId: ownerId });

  return {
    ...owner.toObject(),
    courts,
    totalRevenue: totalRevenue[0]?.total || 0,
    bookingCount,
  };
};

const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (user.role === 'admin') {
    const error = new Error('Cannot modify admin account');
    error.status = 403;
    throw error;
  }

  user.isActive = !user.isActive;
  await user.save();

  return {
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  };
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (user.role === 'admin') {
    const error = new Error('Cannot delete admin account');
    error.status = 403;
    throw error;
  }

  await User.findByIdAndDelete(userId);

  return { message: 'User deleted successfully' };
};

const getSystemDashboard = async () => {
  const totalOwners = await User.countDocuments({ role: 'owner' });
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalCourts = await Court.countDocuments();
  const totalBookings = await Booking.countDocuments();

  const revenueResult = await Revenue.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalRevenue' }, courtRevenue: { $sum: '$courtRevenue' }, drinkRevenue: { $sum: '$drinkRevenue' } } },
  ]);

  const revenueByOwner = await Revenue.aggregate([
    {
      $group: {
        _id: '$adminId',
        totalRevenue: { $sum: '$totalRevenue' },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'ownerDetails',
      },
    },
    { $unwind: '$ownerDetails' },
    { $sort: { totalRevenue: -1 } },
  ]);

  return {
    totalOwners,
    totalCustomers,
    totalCourts,
    totalBookings,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
    courtRevenue: revenueResult[0]?.courtRevenue || 0,
    drinkRevenue: revenueResult[0]?.drinkRevenue || 0,
    revenueByOwner,
  };
};

module.exports = {
  createOwner,
  getAllOwners,
  getAllCustomers,
  getOwnerById,
  toggleUserStatus,
  deleteUser,
  getSystemDashboard,
};
