const validateCreateDrink = (body) => {
  const errors = [];

  // name
  if (!body.name || typeof body.name !== "string") {
    errors.push("Tên đồ uống là bắt buộc");
  } else if (body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push("Tên đồ uống phải từ 2-100 ký tự");
  }

  // price - parse sang number vì form-data gửi lên là string
  const price = Number(body.price);
  if (body.price === undefined || body.price === null || body.price === "") {
    errors.push("Giá là bắt buộc");
  } else if (isNaN(price) || price <= 0) {
    errors.push("Giá phải là số lớn hơn 0");
  }

  // quantity (optional)
  if (body.quantity !== undefined && body.quantity !== "") {
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.push("Số lượng phải là số nguyên >= 0");
    }
  }

  // minStock (optional)
  if (body.minStock !== undefined && body.minStock !== "") {
    const minStock = Number(body.minStock);
    if (!Number.isInteger(minStock) || minStock < 0) {
      errors.push("minStock phải là số nguyên >= 0");
    }
  }

  return errors;
};

const validateUpdateDrink = (body) => {
  const errors = [];

  if (body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 100
    ) {
      errors.push("Tên đồ uống phải từ 2-100 ký tự");
    }
  }

  if (body.price !== undefined && body.price !== "") {
    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      errors.push("Giá phải là số lớn hơn 0");
    }
  }

  if (body.quantity !== undefined && body.quantity !== "") {
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.push("Số lượng phải là số nguyên >= 0");
    }
  }

  if (body.minStock !== undefined && body.minStock !== "") {
    const minStock = Number(body.minStock);
    if (!Number.isInteger(minStock) || minStock < 0) {
      errors.push("minStock phải là số nguyên >= 0");
    }
  }

  return errors;
};

const validateUpdateStock = (body) => {
  const errors = [];

  if (
    body.quantity === undefined ||
    body.quantity === null ||
    body.quantity === ""
  ) {
    errors.push("quantity là bắt buộc");
  } else {
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity)) {
      errors.push("quantity phải là số nguyên");
    }
  }

  return errors;
};

const DRINK_UPDATE_FIELDS = [
  "name",
  "price",
  "quantity",
  "minStock",
  "description",
  "image",
];

module.exports = {
  validateCreateDrink,
  validateUpdateDrink,
  validateUpdateStock,
  DRINK_UPDATE_FIELDS,
};
