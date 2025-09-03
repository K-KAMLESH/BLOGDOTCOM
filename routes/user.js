const { Router } = require("express");
const router = Router();
const User = require("../model/user");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signup", async (req, res) => {
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  res.redirect("/user/signin");
});

router.post("/signin", async (req, res) => {
  const { password, email } = req.body;
  console.log(email, password);
  try {
    const token = await User.findById(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    res.render("signin", { error: "invalid Email andd password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = router;
