const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo các thư mục upload tồn tại
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage config theo loại
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join('uploads', subfolder);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });
};

// Filter chỉ cho phép ảnh
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, png, gif, webp)'), false);
  }
};

// Giới hạn size 5MB
const limits = { fileSize: 5 * 1024 * 1024 };

// Upload nhiều ảnh cho Court (tối đa 10)
const uploadCourtImages = multer({
  storage: createStorage('courts'),
  fileFilter: imageFilter,
  limits,
}).array('images', 10);

// Upload 1 ảnh cho Drink
const uploadDrinkImage = multer({
  storage: createStorage('drinks'),
  fileFilter: imageFilter,
  limits,
}).single('image');

// Upload avatar cho User
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter: imageFilter,
  limits,
}).single('avatar');

// Middleware wrapper xử lý lỗi multer
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File quá lớn. Giới hạn 5MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Quá nhiều file hoặc sai field name.' });
        }
        return res.status(400).json({ error: `Lỗi upload: ${err.message}` });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

// Utility: xóa file cũ
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  uploadCourtImages: handleUpload(uploadCourtImages),
  uploadDrinkImage: handleUpload(uploadDrinkImage),
  uploadAvatar: handleUpload(uploadAvatar),
  deleteFile,
};
