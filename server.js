const express = require("express");
const db = require("./BackEnd/DB/db-config");
const app = express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 3000;

app.use("/scripts", express.static(__dirname + '/FrontEnd/scripts'));
app.use("/styles", express.static(__dirname + '/FrontEnd/styles'));
app.use("/assets", express.static(__dirname + '/FrontEnd/assets'));

app.set("view engine", "ejs");
app.set("views", "./FrontEnd/views");

app.use(cookie());
app.use(express.json());

(async () => {
  try {
    await db.query('SELECT 1');
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();



app.use("/", require("./BackEnd/routes/pages"));
app.use("/api", require("./BackEnd/routes/auth"));
app.use("/api", require("./BackEnd/routes/products"));
app.use("/api/cart", require("./BackEnd/routes/cartRoutes"));
app.use("/api/user", require("./BackEnd/routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
