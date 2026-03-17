const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { validateRegister, validateLogin, validateUpdateProfile } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);
router.put('/profile', validate(validateUpdateProfile), updateProfile);

module.exports = router;
