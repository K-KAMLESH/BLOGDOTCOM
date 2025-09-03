require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middleware/authentication");
const Blog = require("./model/blog");
const methodOverride = require("method-override");
const path = require("path");

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

// routes
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

// setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

//middlewares
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthenticationCookie("token"));
app.use(methodOverride("_method"));
app.use(express.json());

//connet to mongo
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("mongoDB is Connected");
  })
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { allBlogs: allBlogs, user: req.user });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// listen to app
app.listen(PORT, () => {
  console.log(`server is started on ${PORT}`);
});
