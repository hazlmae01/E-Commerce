const express = require("express");
const db = require("./BackEnd/DB/db-config");
const app = express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 3000;

app.use("/scripts", express.static(__dirname + '/FrontEnd/scripts'))
app.use("/styles", express.static(__dirname + '/FrontEnd/styles'))
app.set("view engine", "ejs");
app.set("views", "./FrontEnd/views");
app.use(cookie());
app.use(express.json());
db.connect((err) =>{
    if(err) throw err;
})
app.use("/", require("./BackEnd/DB/pages"));
app.use("/api", require("./BackEnd/controllers/auth"))
app.listen(PORT);