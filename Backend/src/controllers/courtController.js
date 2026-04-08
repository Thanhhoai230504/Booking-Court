const courtService = require("../services/courtService");

const getAvailableCourts = async (req, res) => {
  try {
    const result = await courtService.getAvailableCourts(req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getCourtById = async (req, res) => {
  try {
    const result = await courtService.getCourtById(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const createCourt = async (req, res) => {
  try {
    // Lấy paths từ multer uploaded files
    const imagePaths = req.files
      ? req.files.map((f) => `/uploads/courts/${f.filename}`)
      : [];
    const result = await courtService.createCourt(
      req.userId,
      req.body,
      imagePaths,
    );
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const updateCourt = async (req, res) => {
  try {
    // Lấy paths từ multer uploaded files (nếu có)
    const imagePaths = req.files
      ? req.files.map((f) => `/uploads/courts/${f.filename}`)
      : [];
    const result = await courtService.updateCourt(
      req.params.id,
      req.userId,
      req.userRole,
      req.body,
      imagePaths,
    );
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getAdminCourts = async (req, res) => {
  try {
    const result = await courtService.getAdminCourts(
      req.params.adminId,
      req.userId,
      req.userRole,
    );
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const result = await courtService.deleteCourt(
      req.params.id,
      req.userId,
      req.userRole,
    );
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = {
  getAvailableCourts,
  getCourtById,
  createCourt,
  updateCourt,
  getAdminCourts,
  deleteCourt,
};
