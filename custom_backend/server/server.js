const db = require("../config/db_connection");
const express = require("express");

const app = express();
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server successfully listening on ${port}`);
})