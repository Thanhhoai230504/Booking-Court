const express = require('express');
const { ownerAuth } = require('../middleware/auth');
const { uploadDrinkImage } = require('../middleware/upload');
const { validate, sanitizeBody } = require('../middleware/validate');
const { validateCreateDrink, validateUpdateDrink, validateUpdateStock, DRINK_UPDATE_FIELDS } = require('../validators/drinkValidator');
const {
  createDrink,
  getAdminDrinks,
  updateDrink,
  updateStock,
  deleteDrink,
} = require('../controllers/drinkController');

const router = express.Router();

router.post('/', ownerAuth, uploadDrinkImage, validate(validateCreateDrink), createDrink);
router.get('/admin/:adminId', ownerAuth, getAdminDrinks);
router.put('/:id', ownerAuth, uploadDrinkImage, sanitizeBody(DRINK_UPDATE_FIELDS), validate(validateUpdateDrink), updateDrink);
router.post('/:id/update-stock', ownerAuth, validate(validateUpdateStock), updateStock);
router.delete('/:id', ownerAuth, deleteDrink);

module.exports = router;
