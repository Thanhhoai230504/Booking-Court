const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const { validateRegister, validateLogin, validateUpdateProfile } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);
router.put('/profile', auth, uploadAvatar, validate(validateUpdateProfile), updateProfile);

module.exports = router;
