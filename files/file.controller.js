const path = require("path");
const { promises: fsPromises } = require("fs");

const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./tmp"));
  },
  filename: (req, file, cb) => {
    const [name, extention] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${extention}`);
  },
});

const uploadMiddleware = multer({ storage });

module.exports.uploadFile = uploadMiddleware.single("avatar");

module.exports.upload = async (req, res) => {
  res.status(200).json({ status: "success" });
};

module.exports.minifyImage = async (req, res, next) => {
  try {
    const { filename, path: tmpPath } = req.file;

    const MINIFY_DIR = "public/images";

    await imagemin([tmpPath.replace(/\\/g, "/")], {
      destination: MINIFY_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    await fsPromises.unlink(tmpPath);

    req.file = {
      ...req.file,
      avatarURL: path.join(MINIFY_DIR, filename).replace(/\\/g, "/"),
      destination: MINIFY_DIR,
    };

    next();
  } catch (error) {
    next(error);
  }
};
