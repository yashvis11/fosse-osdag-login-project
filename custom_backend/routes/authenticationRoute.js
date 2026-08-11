/*route uses controller-> controller uses model. */
const express = require("express");

const router = express.Router();

const {registerUser, loginUser, getProfile, getFiles, getFileId, logoutUser, downloadFile}= require("../controller/authenticationController");
const {verifyToken} = require("../middleware/authenticationMiddleware");


/*call registerUser when the path passed in the requestcontains 
/register */
router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/me", verifyToken, getProfile)
router.get("/files", verifyToken, getFiles)
router.get("/files/:id", verifyToken, getFileId)
router.post("/logout", verifyToken, logoutUser)
router.get("/files/:id/download", verifyToken, downloadFile)
module.exports = router; 