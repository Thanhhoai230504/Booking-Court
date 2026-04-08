const mongoose = require('mongoose');

// ===== Helper Functions =====

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPhone = (value) => /^[0-9]{10,11}$/.test(value);

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isTimeFormat = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const isDateString = (value) => !isNaN(Date.parse(value));

// ===== Validate Middleware Factory =====

/**
 * Tạo middleware validate cho req.body
 * @param {Function} schemaFn - Hàm nhận req.body và trả về mảng lỗi
 * @returns {Function} Express middleware
 */
const validate = (schemaFn) => {
  return (req, res, next) => {
    const errors = schemaFn(req.body, req);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    next();
  };
};

/**
 * Tạo middleware validate cho req.query
 */
const validateQuery = (schemaFn) => {
  return (req, res, next) => {
    const errors = schemaFn(req.query, req);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    next();
  };
};

/**
 * Tạo middleware chỉ cho phép các field trong whitelist
 * Xoá các field không hợp lệ khỏi req.body
 */
const sanitizeBody = (allowedFields) => {
  return (req, res, next) => {
    const sanitized = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        sanitized[field] = req.body[field];
      }
    }
    req.body = sanitized;
    next();
  };
};

/**
 * Middleware để parse numeric fields từ FormData
 * FormData gửi mọi giá trị dưới dạng string, middleware này convert thành number
 */
const parseCourtFormData = (req, res, next) => {
  // Parse pricePerHour nếu tồn tại
  if (req.body.pricePerHour) {
    const parsed = parseFloat(req.body.pricePerHour);
    if (!isNaN(parsed)) {
      req.body.pricePerHour = parsed;
    }
  }

  // Parse totalCourts nếu tồn tại
  if (req.body.totalCourts) {
    const parsed = parseInt(req.body.totalCourts, 10);
    if (!isNaN(parsed)) {
      req.body.totalCourts = parsed;
    }
  }

  // Parse openingHours nếu tồn tại (JSON string)
  if (req.body.openingHours && typeof req.body.openingHours === 'string') {
    try {
      req.body.openingHours = JSON.parse(req.body.openingHours);
    } catch (e) {
      // Nếu parse failed, để nguyên giá trị string
    }
  }

  // Parse hourlyPricing nếu tồn tại (JSON string)
  if (req.body.hourlyPricing && typeof req.body.hourlyPricing === 'string') {
    try {
      req.body.hourlyPricing = JSON.parse(req.body.hourlyPricing);
    } catch (e) {
      // Nếu parse failed, để nguyên giá trị string
    }
  }

  next();
};

module.exports = {
  validate,
  validateQuery,
  sanitizeBody,
  parseCourtFormData,
  isEmail,
  isPhone,
  isObjectId,
  isTimeFormat,
  isDateString,
};