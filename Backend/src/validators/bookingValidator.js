const { body, param, query } = require("express-validator");

const createBookingValidation = [
  body("courtId")
    .notEmpty()
    .withMessage("Court ID không được để trống")
    .isMongoId()
    .withMessage("Court ID không hợp lệ"),

  body("startDate")
    .notEmpty()
    .withMessage("Ngày bắt đầu không được để trống")
    .isISO8601()
    .withMessage("Ngày bắt đầu không hợp lệ"),

  body("startTime")
    .notEmpty()
    .withMessage("Giờ bắt đầu không được để trống")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Giờ bắt đầu phải có định dạng HH:mm"),

  body("endTime")
    .notEmpty()
    .withMessage("Giờ kết thúc không được để trống")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Giờ kết thúc phải có định dạng HH:mm"),

  body("durationHours")
    .notEmpty()
    .withMessage("Số giờ không được để trống")
    .isFloat({ min: 0.5 })
    .withMessage("Số giờ phải lớn hơn hoặc bằng 0.5"),

  body("customerName")
    .notEmpty()
    .withMessage("Tên khách hàng không được để trống")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên khách hàng phải từ 2 đến 100 ký tự"),

  body("customerPhone")
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .isMobilePhone()
    .withMessage("Số điện thoại không hợp lệ"),

  body("bookingType")
    .optional()
    .isIn(["single", "recurring"])
    .withMessage("Loại booking phải là single hoặc recurring"),

  body("paymentMethod")
    .optional()
    .isIn(["online", "cash"])
    .withMessage("Phương thức thanh toán phải là online hoặc cash"),
];

const getCustomerBookingsValidation = [
  query("status")
    .optional()
    .isIn([
      "PENDING_APPROVAL",
      "CONFIRMED",
      "PLAYING",
      "COMPLETED",
      "CANCELLED",
    ])
    .withMessage("Trạng thái không hợp lệ"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Ngày bắt đầu không hợp lệ"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Ngày kết thúc không hợp lệ"),
];

const checkAvailabilityValidation = [
  query("courtId")
    .notEmpty()
    .withMessage("Court ID không được để trống")
    .isMongoId()
    .withMessage("Court ID không hợp lệ"),

  query("date")
    .notEmpty()
    .withMessage("Ngày không được để trống")
    .isISO8601()
    .withMessage("Ngày không hợp lệ"),

  query("startTime")
    .notEmpty()
    .withMessage("Giờ bắt đầu không được để trống")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Giờ bắt đầu phải có định dạng HH:mm"),

  query("endTime")
    .notEmpty()
    .withMessage("Giờ kết thúc không được để trống")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Giờ kết thúc phải có định dạng HH:mm"),
];
module.exports = {
  createBookingValidation,
  checkAvailabilityValidation,
  getCustomerBookingsValidation,
};
