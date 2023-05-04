const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log(res.method, res.url);
  next();
});

app.use("/admin", adminRoutes);
app.use("/", userRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});