/*route uses controller-> controller uses model. */
const express = require("express");
//const {registerUser} = require("../controller/authenticationController")
const router = express.Router();

const {registerUser}= require("../controller/authenticationController");
/*call registerUser when the path passed in the requestcontains 
/register */
router.post("/register", registerUser);
module.exports = router; 