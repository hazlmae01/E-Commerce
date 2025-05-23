const express = require("express");
const db = require("./BackEnd/DB/db-config");
const app = express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 3000;
app.use("/js",express.static(__dirname + "./FrontEnd/scripts"))
app.use("/css",express.static(__dirname + "./FrontEnd/styles"))
app.set("view engine", "ejs");
app.set("views", "./FrontEnd/views");
app.use(cookie());
app.use(express.json());
db.connect((err) =>{
    if(err) throw err;
    console.log("database connected");
});
app.listen(PORT);