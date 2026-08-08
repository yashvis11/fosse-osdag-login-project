/*The browser constructs the HTTP request

The browser turns that into something conceptually like:

POST /register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"email":"abc@gmail.com","password":"123"}

Express reads that HTTP request

Express receives the HTTP request and parses it.

It knows:

HTTP method → POST
request target → /register
headers → ...
body → ...

 */
const cors = require("cors");
    const db = require("../config/db_connection");
    const express = require("express");
    const authenticationRoute = require("../routes/authenticationRoute");
    const app = express();
    app.use(cors({
        origin: "http://127.0.0.1:5500"
    }));
    app.use(express.json());
    const port = 3000;
    /*server mounts the router to any path starting with /. As 
    /register starts with / the request is passed to authenticationRoute */
    app.use("/", authenticationRoute);
    app.listen(port, ()=>{
        console.log(`Server successfully listening on ${port}`);
    })