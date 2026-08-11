const db = require("../config/db_connection")

const checkEmail = (email, callback) => {
  const emailQuery = `SELECT * FROM Users WHERE user_email = $1`;

  db.query(emailQuery, [email], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const createUser=(userData, callback)=>{
  /*user_id is returned so that it can be mapped 
  to the correct JWT key when needed */
  const query = `INSERT INTO Users(user_email, password_hash) VALUES($1, $2)
    RETURNING user_id`;
  const values = [userData.email, userData.password_hashed];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
}

const verifyLock = (userId, callback) =>{
  const verifyLockQuery = `SELECT locked_until > NOW() AS is_locked FROM Users WHERE user_id = $1`

  db.query(verifyLockQuery, [userId], (err, result)=>{
    callback(err, result)
  })
}

const increaseFailedAttempt = (userId, callback) =>{
  console.log("user id", userId);
  /*RETURNING is used as the update query does not return a value bu rowCount stating how many rows were 
  updated, here it helps us get the number of failed attempts*/
  const increaseAttemptQuery = `UPDATE Users SET failed_login_attempts = failed_login_attempts + 1
  WHERE user_id = $1 RETURNING failed_login_attempts`;

  db.query(increaseAttemptQuery, [userId], (err, result)=>{
    callback(err, result)
  })
}

const lockUser = (userId, callback) =>{
  const lockUserQuery = `UPDATE Users SET locked_until = NOW() + INTERVAL '5 minutes' WHERE user_id = $1`

  db.query(lockUserQuery, [userId], (err, result)=>{
    callback(err, result)
  })
}

const getUser = (user_id, callback) =>{
  const profileQuery = `SELECT user_id, user_email, fullname,
            displayname,
            bio,
            createdat,
            role FROM Users WHERE user_id = $1`;

  db.query(profileQuery, [user_id], (err, result) =>{
    callback(err, result)
  })
}
const getFileAll = (user_id, callback) =>{
  const fileAllQuery = `SELECT * FROM Files WHERE user_id = $1`;

  db.query(fileAllQuery, [user_id], (err, result)=>{
    callback(err, result);
  })
}
const checkForFile = (fileId, callback) =>{
  const checkFileQuery = `SELECT * FROM Files WHERE file_id = $1`

  db.query(checkFileQuery, [fileId], (err, result)=>{
    callback(err, result)
  })
}
const getFileById = (userId, fileId, callback) =>{
  const fileIdQuery = `SELECT * FROM Files WHERE user_id = $1 AND file_id= $2`

  db.query(fileIdQuery, [userId, fileId], (err, result)=>{
    callback(err, result);
  })
}
module.exports = { createUser, checkEmail, getUser, getFileAll, checkForFile, 
getFileById, verifyLock, increaseFailedAttempt, lockUser};

