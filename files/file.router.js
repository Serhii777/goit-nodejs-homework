const express = require("express");

const router = express.Router();
const { uploadFile, upload, minifyImage } = require("./file.controller");
const { asyncWrapper } = require("../helpers/helpers");

router.post("/upload", uploadFile, minifyImage, asyncWrapper(upload));

router.use("/images", express.static("./public/images"), asyncWrapper(upload));

module.exports = router;
