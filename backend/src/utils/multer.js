import multer from "multer";

const storage = multer.memoryStorage();

const photoUpload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Images only!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default photoUpload;
