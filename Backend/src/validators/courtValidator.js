const { isTimeFormat } = require("../middleware/validate");

const validateCreateCourt = (body) => {
  const errors = [];

  // name
  if (!body.name || typeof body.name !== "string") {
    errors.push("Tên sân là bắt buộc");
  } else if (body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push("Tên sân phải từ 2-100 ký tự");
  }

  // address
  if (!body.address || typeof body.address !== "string") {
    errors.push("Địa chỉ là bắt buộc");
  } else if (
    body.address.trim().length < 5 ||
    body.address.trim().length > 200
  ) {
    errors.push("Địa chỉ phải từ 5-200 ký tự");
  }

  // pricePerHour - parse vì form-data gửi string
  const pricePerHour = Number(body.pricePerHour);
  if (
    body.pricePerHour === undefined ||
    body.pricePerHour === null ||
    body.pricePerHour === ""
  ) {
    errors.push("Giá mỗi giờ là bắt buộc");
  } else if (isNaN(pricePerHour) || pricePerHour <= 0) {
    errors.push("Giá mỗi giờ phải là số lớn hơn 0");
  }

  // totalCourts - parse vì form-data gửi string
  if (body.totalCourts !== undefined && body.totalCourts !== "") {
    const totalCourts = Number(body.totalCourts);
    if (!Number.isInteger(totalCourts) || totalCourts < 1) {
      errors.push("Tổng số sân phải là số nguyên >= 1");
    }
  }

  // openingHours - parse vì form-data gửi string JSON
  if (body.openingHours) {
    let openingHours = body.openingHours;
    if (typeof openingHours === "string") {
      try {
        openingHours = JSON.parse(openingHours);
      } catch {
        errors.push("openingHours không hợp lệ");
      }
    }
    if (typeof openingHours === "object") {
      if (openingHours.start && !isTimeFormat(openingHours.start)) {
        errors.push("Giờ mở cửa phải có định dạng HH:mm");
      }
      if (openingHours.end && !isTimeFormat(openingHours.end)) {
        errors.push("Giờ đóng cửa phải có định dạng HH:mm");
      }
    }
  }

  // hourlyPricing - parse vì form-data gửi string JSON
  if (body.hourlyPricing !== undefined && body.hourlyPricing !== "") {
    let hourlyPricing = body.hourlyPricing;
    if (typeof hourlyPricing === "string") {
      try {
        hourlyPricing = JSON.parse(hourlyPricing);
      } catch {
        errors.push("hourlyPricing không hợp lệ");
      }
    }
    if (!Array.isArray(hourlyPricing)) {
      errors.push("hourlyPricing phải là một mảng");
    } else {
      hourlyPricing.forEach((item, index) => {
        if (!item.hour || !isTimeFormat(item.hour)) {
          errors.push(`hourlyPricing[${index}].hour phải có định dạng HH:mm`);
        }
        const price = Number(item.price);
        if (isNaN(price) || price <= 0) {
          errors.push(`hourlyPricing[${index}].price phải là số lớn hơn 0`);
        }
      });
    }
  }

  return errors;
};

const validateUpdateCourt = (body) => {
  const errors = [];

  if (body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 100
    ) {
      errors.push("Tên sân phải từ 2-100 ký tự");
    }
  }

  if (body.address !== undefined && body.address !== "") {
    if (
      typeof body.address !== "string" ||
      body.address.trim().length < 5 ||
      body.address.trim().length > 200
    ) {
      errors.push("Địa chỉ phải từ 5-200 ký tự");
    }
  }

  if (body.pricePerHour !== undefined && body.pricePerHour !== "") {
    const pricePerHour = Number(body.pricePerHour);
    if (isNaN(pricePerHour) || pricePerHour <= 0) {
      errors.push("Giá mỗi giờ phải là số lớn hơn 0");
    }
  }

  if (body.totalCourts !== undefined && body.totalCourts !== "") {
    const totalCourts = Number(body.totalCourts);
    if (!Number.isInteger(totalCourts) || totalCourts < 1) {
      errors.push("Tổng số sân phải là số nguyên >= 1");
    }
  }

  if (body.status !== undefined) {
    if (!["active", "maintenance", "inactive"].includes(body.status)) {
      errors.push(
        'Trạng thái phải là "active", "maintenance", hoặc "inactive"',
      );
    }
  }

  if (body.openingHours) {
    let openingHours = body.openingHours;
    if (typeof openingHours === "string") {
      try {
        openingHours = JSON.parse(openingHours);
      } catch {}
    }
    if (typeof openingHours === "object") {
      if (openingHours.start && !isTimeFormat(openingHours.start)) {
        errors.push("Giờ mở cửa phải có định dạng HH:mm");
      }
      if (openingHours.end && !isTimeFormat(openingHours.end)) {
        errors.push("Giờ đóng cửa phải có định dạng HH:mm");
      }
    }
  }

  return errors;
};

const COURT_UPDATE_FIELDS = [
  "name",
  "address",
  "city",
  "images",
  "description",
  "totalCourts",
  "pricePerHour",
  "hourlyPricing",
  "openingHours",
  "status",
];

module.exports = {
  validateCreateCourt,
  validateUpdateCourt,
  COURT_UPDATE_FIELDS,
};
