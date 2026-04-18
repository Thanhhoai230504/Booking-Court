const adminManagementService = require('../services/adminManagementService');

const createOwner = async (req, res) => {
  try {
    const result = await adminManagementService.createOwner(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getAllOwners = async (req, res) => {
  try {
    const result = await adminManagementService.getAllOwners();
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const result = await adminManagementService.getAllCustomers();
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getOwnerById = async (req, res) => {
  try {
    const result = await adminManagementService.getOwnerById(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const result = await adminManagementService.toggleUserStatus(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await adminManagementService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getSystemDashboard = async (req, res) => {
  try {
    const result = await adminManagementService.getSystemDashboard();
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
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
