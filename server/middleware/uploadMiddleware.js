const multer = require('multer');

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Only PDF and DOCX resume files are supported');
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  }
});

module.exports = upload;
