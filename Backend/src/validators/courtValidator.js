const { body, param, query } = require("express-validator");

const createCourtValidation = [
  body("name")
    .notEmpty()
    .withMessage("Tên sân không được để trống")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên sân phải từ 2 đến 100 ký tự"),

  body("address").notEmpty().withMessage("Địa chỉ không được để trống").trim(),

  body("city").optional().trim(),

  body("pricePerHour")
    .notEmpty()
    .withMessage("Giá mỗi giờ không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá mỗi giờ phải là số lớn hơn hoặc bằng 0"),

  body("totalCourts")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Số sân phải là số nguyên lớn hơn 0"),

  body("description").optional().trim(),

  body("images").optional().isArray().withMessage("Images phải là một mảng"),
];

const updateCourtValidation = [
  param("id").isMongoId().withMessage("Court ID không hợp lệ"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên sân phải từ 2 đến 100 ký tự"),

  body("address").optional().trim(),

  body("pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá mỗi giờ phải là số lớn hơn hoặc bằng 0"),

  body("totalCourts")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Số sân phải là số nguyên lớn hơn 0"),

  body("status")
    .optional()
    .isIn(["active", "maintenance", "inactive"])
    .withMessage("Trạng thái phải là active, maintenance hoặc inactive"),
];

const courtIdParamValidation = [
  param("id").isMongoId().withMessage("Court ID không hợp lệ"),
];

const getAvailableCourtsValidation = [
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá tối đa phải là số lớn hơn hoặc bằng 0"),
];

const adminCourtsValidation = [
  param("adminId").isMongoId().withMessage("Admin ID không hợp lệ"),
];

module.exports = {
  createCourtValidation,
  updateCourtValidation,
  courtIdParamValidation,
  getAvailableCourtsValidation,
  adminCourtsValidation,
};
