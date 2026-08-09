const {createUser, checkEmail, getUser} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res)=>{//req= options
    const checkFeilds = (email, password, callback)=>{
        if(!req.body.email && !req.body.password){
            return callback(new Error("Both email and password are missing"));
        }
        else if(!req.body.password){
            return callback(new Error("Password is missing. Please enter password"))
        }
        else if (!req.body.email) {
            return callback(new Error("Email is missing. Please enter email"));
        }
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
        return res.status(501).json({
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
        res.status(200).json({
          message: "User successfully registered",
        });
      });
    });
}

const loginUser = async (req, res)=>{
  //check if all the required feilds are filled
    const checkFeilds = (email, password, callback) => {
      if (!req.body.email && !req.body.password) {
        return callback(new Error("Both email and password are missing"));
      } else if (!req.body.password) {
        return callback(
          new Error("Password is missing. Please enter password"),
        );
      } else if (!req.body.email) {
        return callback(new Error("Email is missing. Please enter email"));
      }
    };
    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    checkEmail(userData.email, (err, result)=>{
      if(err){
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }
      //no user found
      if(result.rows.length===0){
        return res.status(501).json({
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
          return res.status(501).json({
            message:"Invalid password"
          })
        }
        //if both password and email are correct store the user's id for further process
        const user_id_found = user.user_id;
        return res.status(200).json({
          message:"Login successful",
          user_id: user_id
        })
      })
    getUser();
}
module.exports = {registerUser, loginUser};