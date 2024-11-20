const multer = require("multer");
const path = require("path");

const tmpDir = path.join(__dirname, "../tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const limits = {
  fileSize: 1024 * 1024, // 1MB
};

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only jpg, png, and gif are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;
