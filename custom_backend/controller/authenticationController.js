const {createUser, checkEmail, getUser} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res)=>{//req= options
    const checkFeilds = (email, password)=>{
        if(!email && !password){
            return (new Error("Both email and password are missing"));
        }
        else if(!password){
            return (new Error("Password is missing. Please enter password"))
        }
        else if (!email) {
            return (new Error("Email is missing. Please enter email"));
        }
      }
      const feildError = checkFeilds(req.body.email, req.body.password)
      if(feildError){
        return res.status(400).json({
          message: feildError.message
        })
      }
    const hashed_password = await bcrypt.hash(req.body.password,10);
    const userData = {
        email: req.body.email,
        password_hashed: hashed_password,
    }
    checkEmail(userData.email, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }
      if(result.rows.length>0){
        return res.status(409).json({
          message: "Email already exists"
        })
      }
      //create user if email doesn't exist
      createUser(userData, (err, result) => {
        if (err) {
          console.log("Registration error", err);
          return res.status(500).json({
            message: "Unable to register user",
            error: err.message,
          });
        }
        res.status(201).json({
          message: "User successfully registered",
        });
      });
    });
}

const loginUser = async (req, res)=>{
  //check if all the required feilds are filled
    const checkFeilds = (email, password)=>{
        if(!email && !password){
            return (new Error("Both email and password are missing"));
        }
        else if(!password){
            return (new Error("Password is missing. Please enter password"))
        }
        else if (!email) {
            return (new Error("Email is missing. Please enter email"));
        }
      }
      const feildError = checkFeilds(req.body.email, req.body.password)
      if(feildError){
        return res.status(400).json({
          message: feildError.message
        })
      }
    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    checkEmail(userData.email, async (err, result)=>{
      if(err){
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }
      //no user found
      if(result.rows.length===0){
        return res.status(401).json({
          message:"Invalid email or password"
        })
        
      }
      //if user is found get all the details related to that user 
        const user = result.rows[0];
        //check password to ensure nobody else can login for another user
        const passwordCheck = await bcrypt.compare(
          userData.password,
          user.password_hash
        );
        if(!passwordCheck){
          return res.status(401).json({
            message:"Invalid email or password"
          })
        }
        //if both password and email are correct store the user's id for further process
        const user_id_found = user.user_id;
        const token = jwt.sign(
          {user_id: user.user_id},
          process.env.JWT_SECRET,
          {expiresIn: "1h"} 
        )

        return res.status(200).json({
          message:"Login successful",
          token: token
        })
      })
}
module.exports = {registerUser, loginUser};