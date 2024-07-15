const Multer = require('multer');
const mimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

const generateUploadImageMulter = () =>
  Multer({
    storage: Multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (mimetypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Invalid file type'), false);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  });

const uploadProfileImages = generateUploadImageMulter();
const uploadResidentImages = generateUploadImageMulter();

module.exports = { uploadProfileImages, uploadResidentImages };
