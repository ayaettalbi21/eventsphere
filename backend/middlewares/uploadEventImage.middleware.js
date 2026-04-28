const multer = require("multer");
const path = require("path");

// stockage disque
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "event-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// filtre sécurité (images seulement)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const uploadEventImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadEventImage;
