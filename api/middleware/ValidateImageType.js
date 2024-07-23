const multer = require('multer');

const validateImageType = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
      }
  }
});

module.exports = {validateImageType}