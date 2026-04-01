const courtService = require("../services/courtService");

const getAvailableCourts = async (req, res) => {
  try {
    const courts = await courtService.getAvailableCourts(req.query);
    res.json(courts);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getCourtById = async (req, res) => {
  try {
    const court = await courtService.getCourtById(req.params.id);
    res.json(court);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const createCourt = async (req, res) => {
  try {
    const result = await courtService.createCourt(req.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const updateCourt = async (req, res) => {
  try {
    const result = await courtService.updateCourt(
      req.params.id,
      req.userId,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getAdminCourts = async (req, res) => {
  try {
    const courts = await courtService.getAdminCourts(
      req.params.adminId,
      req.userId,
    );
    res.json(courts);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const result = await courtService.deleteCourt(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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
