const revenueService = require('../services/revenueService');

const getDashboard = async (req, res) => {
  try {
    const result = await revenueService.getDashboard(req.params.adminId, req.userId, req.userRole, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getRevenueByDate = async (req, res) => {
  try {
    const result = await revenueService.getRevenueByDate(req.params.adminId, req.userId, req.userRole, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getRevenueByMonth = async (req, res) => {
  try {
    const result = await revenueService.getRevenueByMonth(req.params.adminId, req.userId, req.userRole, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getRevenueByCourtController = async (req, res) => {
  try {
    const result = await revenueService.getRevenueByCourt(req.params.adminId, req.userId, req.userRole, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = {
  getDashboard,
  getRevenueByDate,
  getRevenueByMonth,
  getRevenueByCourtController,
};
