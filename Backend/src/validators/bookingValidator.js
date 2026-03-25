const { isObjectId, isTimeFormat, isDateString, isPhone } = require('../middleware/validate');

const validateCreateBooking = (body) => {
  const errors = [];

  // courtId
  if (!body.courtId) {
    errors.push('courtId là bắt buộc');
  } else if (!isObjectId(body.courtId)) {
    errors.push('courtId không hợp lệ');
  }

  // startDate
  if (!body.startDate) {
    errors.push('startDate là bắt buộc');
  } else if (!isDateString(body.startDate)) {
    errors.push('startDate không đúng định dạng ngày');
  } else {
    const start = new Date(body.startDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (start < now) {
      errors.push('startDate không được nằm trong quá khứ');
    }
  }

  // startTime
  if (!body.startTime) {
    errors.push('startTime là bắt buộc');
  } else if (!isTimeFormat(body.startTime)) {
    errors.push('startTime phải có định dạng HH:mm (ví dụ: 08:00)');
  }

  // endTime
  if (!body.endTime) {
    errors.push('endTime là bắt buộc');
  } else if (!isTimeFormat(body.endTime)) {
    errors.push('endTime phải có định dạng HH:mm (ví dụ: 10:00)');
  }

  // durationHours
  if (body.durationHours === undefined || body.durationHours === null) {
    errors.push('durationHours là bắt buộc');
  } else if (typeof body.durationHours !== 'number' || body.durationHours <= 0) {
    errors.push('durationHours phải là số lớn hơn 0');
  }

  // customerName
  if (!body.customerName || typeof body.customerName !== 'string') {
    errors.push('customerName là bắt buộc');
  } else if (body.customerName.trim().length < 2 || body.customerName.trim().length > 100) {
    errors.push('customerName phải từ 2-100 ký tự');
  }

  // customerPhone
  if (!body.customerPhone || typeof body.customerPhone !== 'string') {
    errors.push('customerPhone là bắt buộc');
  } else if (!isPhone(body.customerPhone)) {
    errors.push('customerPhone phải có 10-11 chữ số');
  }

  // bookingType (optional)
  if (body.bookingType && !['single', 'recurring'].includes(body.bookingType)) {
    errors.push('bookingType phải là "single" hoặc "recurring"');
  }

  // paymentMethod (optional)
  if (body.paymentMethod && !['online', 'cash'].includes(body.paymentMethod)) {
    errors.push('paymentMethod phải là "online" hoặc "cash"');
  }

  // recurringRule (required if bookingType is recurring)
  if (body.bookingType === 'recurring') {
    if (!body.recurringRule) {
      errors.push('recurringRule là bắt buộc khi bookingType là "recurring"');
    } else {
      if (!body.recurringRule.frequency || !['weekly', 'biweekly', 'monthly'].includes(body.recurringRule.frequency)) {
        errors.push('recurringRule.frequency phải là "weekly", "biweekly", hoặc "monthly"');
      }
      if (!body.recurringRule.endDate) {
        errors.push('recurringRule.endDate là bắt buộc');
      } else if (!isDateString(body.recurringRule.endDate)) {
        errors.push('recurringRule.endDate không đúng định dạng ngày');
      }
    }
  }

  return errors;
};

const validateAddDrink = (body) => {
  const errors = [];

  if (!body.drinkId) {
    errors.push('drinkId là bắt buộc');
  } else if (!isObjectId(body.drinkId)) {
    errors.push('drinkId không hợp lệ');
  }

  if (body.quantity === undefined || body.quantity === null) {
    errors.push('quantity là bắt buộc');
  } else if (!Number.isInteger(body.quantity) || body.quantity < 1) {
    errors.push('quantity phải là số nguyên >= 1');
  }

  return errors;
};

const validateUpdateBooking = (body) => {
  const errors = [];

  if (body.startTime !== undefined && !isTimeFormat(body.startTime)) {
    errors.push('startTime phải có định dạng HH:mm');
  }

  if (body.endTime !== undefined && !isTimeFormat(body.endTime)) {
    errors.push('endTime phải có định dạng HH:mm');
  }

  if (body.durationHours !== undefined) {
    if (typeof body.durationHours !== 'number' || body.durationHours <= 0) {
      errors.push('durationHours phải là số lớn hơn 0');
    }
  }

  if (body.drinkUpdates !== undefined) {
    if (!Array.isArray(body.drinkUpdates)) {
      errors.push('drinkUpdates phải là một mảng');
    } else {
      body.drinkUpdates.forEach((update, index) => {
        if (!update.drinkId || !isObjectId(update.drinkId)) {
          errors.push(`drinkUpdates[${index}].drinkId không hợp lệ`);
        }
        if (!['add', 'remove'].includes(update.action)) {
          errors.push(`drinkUpdates[${index}].action phải là "add" hoặc "remove"`);
        }
        if (update.action === 'add') {
          if (!Number.isInteger(update.quantity) || update.quantity < 1) {
            errors.push(`drinkUpdates[${index}].quantity phải là số nguyên >= 1`);
          }
        }
      });
    }
  }

  return errors;
};

module.exports = {
  validateCreateBooking,
  validateAddDrink,
  validateUpdateBooking,
};
