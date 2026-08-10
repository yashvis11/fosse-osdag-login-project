/*route uses controller-> controller uses model. */
const express = require("express");

const router = express.Router();

const {registerUser, loginUser, getProfile, getFiles}= require("../controller/authenticationController");
const {verifyToken} = require("../middleware/authenticationMiddleware");


/*call registerUser when the path passed in the requestcontains 
/register */
router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/me", verifyToken, getProfile)
router.get("/files", verifyToken, getFiles)
module.exports = router; 