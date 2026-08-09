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
module.exports = {createUser, checkEmail};

