const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(400).json({
            message: "User is not logged in"
        })
    }
    const userToken = req.headers.authorization.split(" ")[1];//seperate the word Bearer and the token
    //verify if the token is the same and not altered using the signature 
    //verifies the current token 
    jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded_data)=>{
        if(err){//token has been tampered
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }
        req.user = decoded_data //no tampering get the user details into a new user property 
        next();
    });
}
module.exports = {verifyToken};