const { isEmail, isPhone } = require('../middleware/validate');

const validateRegister = (body) => {
  const errors = [];

  // name
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Tên là bắt buộc');
  } else if (body.name.trim().length < 2 || body.name.trim().length > 50) {
    errors.push('Tên phải từ 2-50 ký tự');
  }

  // email
  if (!body.email || typeof body.email !== 'string') {
    errors.push('Email là bắt buộc');
  } else if (!isEmail(body.email)) {
    errors.push('Email không đúng định dạng');
  }

  // phone
  if (!body.phone || typeof body.phone !== 'string') {
    errors.push('Số điện thoại là bắt buộc');
  } else if (!isPhone(body.phone)) {
    errors.push('Số điện thoại phải có 10-11 chữ số');
  }

  // password
  if (!body.password || typeof body.password !== 'string') {
    errors.push('Mật khẩu là bắt buộc');
  } else if (body.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // role (optional)
  if (body.role && !['customer', 'admin'].includes(body.role)) {
    errors.push('Role phải là "customer" hoặc "admin"');
  }

  return errors;
};

const validateLogin = (body) => {
  const errors = [];

  if (!body.email || typeof body.email !== 'string') {
    errors.push('Email là bắt buộc');
  } else if (!isEmail(body.email)) {
    errors.push('Email không đúng định dạng');
  }

  if (!body.password || typeof body.password !== 'string') {
    errors.push('Mật khẩu là bắt buộc');
  }

  return errors;
};

const validateUpdateProfile = (body) => {
  const errors = [];

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 50) {
      errors.push('Tên phải từ 2-50 ký tự');
    }
  }

  if (body.phone !== undefined) {
    if (typeof body.phone !== 'string' || !isPhone(body.phone)) {
      errors.push('Số điện thoại phải có 10-11 chữ số');
    }
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
};
