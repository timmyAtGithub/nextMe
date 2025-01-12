const multer = require('multer');

const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/media");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
const uploadMedia = multer({
    storage: mediaStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
        } else {
        cb(null, true);
        }
    },
 });

 module.exports = uploadMedia;
