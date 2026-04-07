const Revenue = require('../models/Revenue');

const getDashboard = async (adminId, userId, userRole, filters) => {
  // Admin xem tất cả, owner chỉ xem của mình
  if (userRole !== 'admin' && adminId !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const { startDate, endDate, courtId } = filters;

  let filter = {};
  
  // Owner chỉ xem doanh thu của mình
  if (userRole !== 'admin') {
    filter.adminId = userId;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (courtId) filter.courtId = courtId;

  const revenues = await Revenue.find(filter)
    .populate('courtId', 'name')
    .populate('bookingId', 'bookingNumber');

  const totalRevenue = revenues.reduce((sum, r) => sum + r.totalRevenue, 0);
  const courtRevenue = revenues.reduce((sum, r) => sum + r.courtRevenue, 0);
  const drinkRevenue = revenues.reduce((sum, r) => sum + r.drinkRevenue, 0);

  return {
    totalRevenue,
    courtRevenue,
    drinkRevenue,
    transactionCount: revenues.length,
    revenues,
  };
};

const getRevenueByDate = async (adminId, userId, userRole, filters) => {
  if (userRole !== 'admin' && adminId !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const { startDate, endDate } = filters;

  let match = {};
  if (userRole !== 'admin') {
    match.adminId = userId;
  }

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const revenues = await Revenue.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        totalRevenue: { $sum: '$totalRevenue' },
        courtRevenue: { $sum: '$courtRevenue' },
        drinkRevenue: { $sum: '$drinkRevenue' },
        transactionCount: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  return revenues;
};

const getRevenueByMonth = async (adminId, userId, userRole, filters) => {
  if (userRole !== 'admin' && adminId !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const { year } = filters;

  const match = {};
  if (userRole !== 'admin') {
    match.adminId = userId;
  }

  if (year) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);
    match.date = { $gte: startOfYear, $lte: endOfYear };
  }

  const revenues = await Revenue.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$date' },
        },
        totalRevenue: { $sum: '$totalRevenue' },
        courtRevenue: { $sum: '$courtRevenue' },
        drinkRevenue: { $sum: '$drinkRevenue' },
        transactionCount: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  return revenues;
};

const getRevenueByCourt = async (adminId, userId, userRole, filters) => {
  if (userRole !== 'admin' && adminId !== userId) {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const { startDate, endDate } = filters;

  let match = {};
  if (userRole !== 'admin') {
    match.adminId = userId;
  }

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const revenues = await Revenue.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$courtId',
        totalRevenue: { $sum: '$totalRevenue' },
        courtRevenue: { $sum: '$courtRevenue' },
        drinkRevenue: { $sum: '$drinkRevenue' },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'courts',
        localField: '_id',
        foreignField: '_id',
        as: 'courtDetails',
      },
    },
    { $unwind: '$courtDetails' },
    { $sort: { totalRevenue: -1 } },
  ]);

  return revenues;
};

module.exports = {
  getDashboard,
  getRevenueByDate,
  getRevenueByMonth,
  getRevenueByCourt,
};
