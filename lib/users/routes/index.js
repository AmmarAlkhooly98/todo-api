const express = require("express");
const router = express.Router();
const controller = require("../controller");
const auth = require("../../auth-services");
const multer = require("multer");
const upload = multer();

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.get("/profile", auth.verifyUser, controller.getProfile);

router.post(
  "/uploadPhoto",
  auth.verifyUser,
  upload.single("file"),
  controller.uploadPhoto
);

module.exports = router;
