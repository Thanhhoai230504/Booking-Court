const express = require("express");
const { validationResult } = require("express-validator");
const { auth, adminAuth } = require("../middleware/auth");
const {
  createCourtValidation,
  updateCourtValidation,
  courtIdParamValidation,
  getAvailableCourtsValidation,
  adminCourtsValidation,
} = require("../validators/courtValidator");
const {
  getAvailableCourts,
  getCourtById,
  createCourt,
  updateCourt,
  getAdminCourts,
  deleteCourt,
} = require("../controllers/courtController");

const router = express.Router();

// Middleware xử lý kết quả validation từ express-validator
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: errors.array() });
  }
  next();
};

router.get(
  "/available",
  getAvailableCourtsValidation,
  handleValidation,
  getAvailableCourts,
);
router.get("/:id", courtIdParamValidation, handleValidation, getCourtById);
router.post(
  "/",
  adminAuth,
  createCourtValidation,
  handleValidation,
  createCourt,
);
router.put(
  "/:id",
  adminAuth,
  updateCourtValidation,
  handleValidation,
  updateCourt,
);
router.get(
  "/admin/:adminId/courts",
  adminAuth,
  adminCourtsValidation,
  handleValidation,
  getAdminCourts,
);
router.delete(
  "/:id",
  adminAuth,
  courtIdParamValidation,
  handleValidation,
  deleteCourt,
);

module.exports = router;
