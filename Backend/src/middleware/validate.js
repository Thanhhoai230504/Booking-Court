const mongoose = require('mongoose');

// ===== Helper Functions =====

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPhone = (value) => /^[0-9]{10,11}$/.test(value);

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isTimeFormat = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const isDateString = (value) => !isNaN(Date.parse(value));

// ===== Validate Middleware Factory =====


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

module.exports = {
  validate,
  validateQuery,
  sanitizeBody,
  isEmail,
  isPhone,
  isObjectId,
  isTimeFormat,
  isDateString,
};
