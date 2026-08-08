

require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect((err)=>{
    if(err){
        console.log("Error in connecting to database", err.message);
        return;
    }
    else{
        console.log("Database connected successfully");
    }
})
module.exports = pool;
// Running a raw SQL query
//const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
