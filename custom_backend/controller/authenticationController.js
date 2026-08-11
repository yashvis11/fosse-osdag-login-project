const {createUser, checkEmail, getUser, getFileAll, checkForFile, getFileById} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

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
    //userData = the request contents 
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
      //this user is different that userData and is contains the details stored in the database
        const user = result.rows[0];
        //check password to ensure nobody else can login for another user
        const passwordCheck = await bcrypt.compare(
          userData.password,//request sent password
          user.password_hash//one in the database, the hashed one
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
const getProfile = async(req, res) =>{
  const user_id_derived = req.user.user_id;
  getUser(user_id_derived, (err, result)=>{
    if(err){
      return res.status(500).json({
        message: "Database error",
        error: err.message
      })
    }
    return res.status(200).json({//if everything is verified then send the user's details in response
      user: result.rows[0]
    })
  })
}
const getFiles = async(req, res) => {
  const user_id = req.user.user_id;

  getFileAll(user_id, (err, result)=>{
    if(err){
      return res.status(500).json({
        message:"Database error"
      })
    }
    return res.status(200).json({
      files: result.rows //returns all the files not just the first one so [0] is not used 
    })
  })
}

const getFileId = async (req, res) =>{
  const userId = req.user.user_id;
  const fileId = req.params.id;
  //function to check if the file even exists
  checkForFile(fileId, (err, result)=>{
    if(err){
      return res.status(500).json({
        message: "Database error"
      })
    }
    if(result.rows.length === 0){
      return res.status(404).json({
        message: "File not found"
      })
    }
    //if it does proceed with fetching the file
    getFileById(userId, fileId, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }
      if (result.rows.length === 0) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }
      return res.status(200).json({
        file: result.rows[0],
      });
    });
  })
}

const logoutUser = async(req, res) =>{
  return res.status(200).json({
    message: "Logout is successful"
  })
}

const downloadFile = async(req, res)=>{
  const userId = req.user.user_id;
  const fileId = req.params.id;
  checkForFile(fileId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "File not found",
      });
    }
    getFileById(userId, fileId, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }
      if (result.rows.length === 0) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }
      const filePath = result.rows[0].file_path;
      const fullPath = path.join(__dirname, "..", filePath);
      res.download(fullPath, result.rows[0].file_name, (err)=>{
        if(err){
          console.log("File download error")
        }
      })
    });
  });
}
module.exports = {registerUser, loginUser, getProfile, getFiles, getFileId, logoutUser, downloadFile};