/*route uses controller-> controller uses model. */
const express = require("express");

const router = express.Router();

const {registerUser, loginUser}= require("../controller/authenticationController");

/*call registerUser when the path passed in the requestcontains 
/register */
router.post("/register", registerUser);
router.post("/login", loginUser)
module.exports = router; 