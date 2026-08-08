const {createUser, checkEmail, checkFeilds} = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res)=>{//req= options
    const checkFeilds = (email, password)=>{
        if(!req.body.email){
        return callback(new Error("Email is missing. Please enter email"))
        }
        else if(!req.body.password){
            return callback(new Error("Password is missing. Please enter password"))
        }
        else if(!req.body.email && !req.body.password){
            return callback(new Error("Both email and password are missing"))
        }
}
    checkFeilds(req.body.email, req.body.password);
    const hashed_password = await bcrypt.hash(req.body.password,10);
    const userData = {
        email: req.body.email,
        password_hashed: hashed_password,
    }
    checkEmail(userData.email, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Email already registered",
          error: err.message,
        });
      }
      res.status(200).json({
        message: "User successfully registered",
      });
    });

    createUser(userData, (err, result)=>{
        if(err){
            console.log("Registration error", err);
            return res.status(500).json({
                message: "Unable to register user",
                error: err.message,
            });
        }
        res.status(200).json({
            message: "User successfully registered",
        })
    })
}
module.exports = {registerUser};