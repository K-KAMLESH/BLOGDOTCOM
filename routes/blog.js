const { Router } = require("express");
const multer = require("multer");
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const fs = require("fs");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addBlog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    coverImage: req.file.filename,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete({ _id: req.params.id });
  } catch (err) {
    console.log(err);
  }
  return res.redirect("/");
});

router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.blogId }).populate(
    "createdBy"
  );
  const comments = await Comment.find({ blogId: req.params.blogId }).populate(
    "createdBy"
  );

  return res.render("blog", { blog, user: req.user, comments });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
