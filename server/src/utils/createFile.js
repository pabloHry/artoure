const multer = require("multer");
const fs = require("fs");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params;
    const dir = `upload/${id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else cb(null, dir);

    return false;
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploads = multer({
  storage: multerConfig,
});

exports.uploadFile = uploads.single("file");
