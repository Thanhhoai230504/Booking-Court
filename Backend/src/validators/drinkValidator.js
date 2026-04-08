const validateCreateDrink = (body) => {
  const errors = [];

  // name
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Tên đồ uống là bắt buộc');
  } else if (body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push('Tên đồ uống phải từ 2-100 ký tự');
  }

  // price
  if (body.price === undefined || body.price === null) {
    errors.push('Giá là bắt buộc');
  } else if (typeof body.price !== 'number' || body.price <= 0) {
    errors.push('Giá phải là số lớn hơn 0');
  }

  // quantity (optional)
  if (body.quantity !== undefined) {
    if (!Number.isInteger(body.quantity) || body.quantity < 0) {
      errors.push('Số lượng phải là số nguyên >= 0');
    }
  }

  // minStock (optional)
  if (body.minStock !== undefined) {
    if (!Number.isInteger(body.minStock) || body.minStock < 0) {
      errors.push('minStock phải là số nguyên >= 0');
    }
  }

  return errors;
};

const validateUpdateDrink = (body) => {
  const errors = [];

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 100) {
      errors.push('Tên đồ uống phải từ 2-100 ký tự');
    }
  }

  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || body.price <= 0) {
      errors.push('Giá phải là số lớn hơn 0');
    }
  }

  if (body.quantity !== undefined) {
    if (!Number.isInteger(body.quantity) || body.quantity < 0) {
      errors.push('Số lượng phải là số nguyên >= 0');
    }
  }

  if (body.minStock !== undefined) {
    if (!Number.isInteger(body.minStock) || body.minStock < 0) {
      errors.push('minStock phải là số nguyên >= 0');
    }
  }

  return errors;
};

const validateUpdateStock = (body) => {
  const errors = [];

  if (body.quantity === undefined || body.quantity === null) {
    errors.push('quantity là bắt buộc');
  } else if (!Number.isInteger(body.quantity)) {
    errors.push('quantity phải là số nguyên');
  }

  return errors;
};

// Whitelist các field cho phép update
const DRINK_UPDATE_FIELDS = [
  'name', 'price', 'quantity', 'minStock', 'description', 'image',
];

module.exports = {
  validateCreateDrink,
  validateUpdateDrink,
  validateUpdateStock,
  DRINK_UPDATE_FIELDS,
};
