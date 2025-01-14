const multer = require("multer");

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Uploading to destination");
    cb(null, "./uploads/media");
  },
  filename: (req, file, cb) => {
    console.log("Processing file:", file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("File Filter Check:", file.mimetype);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

module.exports = uploadMedia;
