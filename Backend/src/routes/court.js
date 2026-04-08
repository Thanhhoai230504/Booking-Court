const express = require("express");
const { auth, ownerAuth } = require("../middleware/auth");
const { uploadCourtImages } = require("../middleware/upload");
const { validate, sanitizeBody } = require("../middleware/validate");
const {
  validateCreateCourt,
  validateUpdateCourt,
  COURT_UPDATE_FIELDS,
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

router.get("/available", getAvailableCourts);
router.get("/:id", getCourtById);
router.post(
  "/",
  ownerAuth,
  uploadCourtImages,
  validate(validateCreateCourt),
  createCourt,
);
router.put(
  "/:id",
  ownerAuth,
  uploadCourtImages,
  sanitizeBody(COURT_UPDATE_FIELDS),
  validate(validateUpdateCourt),
  updateCourt,
);
router.delete("/:id", ownerAuth, deleteCourt);
router.get("/admin/:adminId/courts", ownerAuth, getAdminCourts);

module.exports = router;
