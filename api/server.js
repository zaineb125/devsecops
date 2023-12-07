const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const PORT = 80;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const RateLimit = require("express-rate-limit");
const validator = require("validator");

function sanitizeInput(input) {
  // Use validator's escape function to sanitize input
  const sanitizedInput = validator.escape(input);

  return sanitizedInput;
}
const app = express();
require("dotenv").config();

const limiter = RateLimit({
  windowMs: 1 * 60 * 100000, // 100 minute
  max: 50,
});

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: "https://127.0.0.1" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
// apply rate limiter to all requests
app.use(limiter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connecting with DataBase");
  })
  .catch((err) => {
    console.log("error " + err);
  });

//Signup API
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const usernameString = username.toString();
    const emailString = email.toString();
    const passwordString = password.toString();
    const userDoc = await User.create({
      username: usernameString,
      email: emailString,
      password: bcrypt.hashSync(passwordString, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

//Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailString = email.toString();
  const userDoc = await User.findOne({ email: emailString });
  if (!userDoc) {
    return res.status(400).json("User not found");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ email, id: userDoc._id }, secret, (e, token) => {
      if (e) throw e;
      res.setHeader("Authorization", `Bearer ${token}`);
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json({
          token: token,
          id: userDoc._id,
          email,
        });
    });
  } else {
    res.status(400).json("Wrong Credentials");
  }
});

// profile
app.get("/profile", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

//logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// write a post
app.post("/post", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { originalname, path } = req.file;
  const pathSanitized = sanitizeInput(path);
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = pathSanitized + "." + ext;
  fs.renameSync(pathSanitized, newPath);

  const token = req.headers.authorization;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

//update post
app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const pathSanitized = sanitizeInput(path);
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = pathSanitized + "." + ext;
    fs.renameSync(pathSanitized, newPath);
  }

  const token = req.headers.authorization;
  jwt.verify(token, secret, {}, async (e, info) => {
    if (e) throw e;
    const { id, title, summary, content } = req.body;
    const idSanitized = sanitizeInput(id);
    const titleSanitized = sanitizeInput(title);
    const summarySanitized = sanitizeInput(summary);
    const contentSanitized = sanitizeInput(content);
    const postDoc = await Post.findByIdAndUpdate(
      idSanitized,
      {
        title: titleSanitized,
        summary: summarySanitized,
        content: contentSanitized,
        cover: newPath ? newPath : postDoc.cover,
      },
      { new: true }
    );

    if (!postDoc) {
      return res.status(400).json("Post not found");
    }

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author");
    }

    res.json(postDoc);
  });
});

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findOne({ _id: id });

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postDoc.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

//get posts
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

//get single post
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.post("/post/:id/comments", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { content } = req.body;

    try {
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" });
      }

      const comment = {
        content,
        author: info.id,
      };

      postDoc.comments.push(comment);
      await postDoc.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });
});

// get comments for a post
app.get("/post/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id).populate("comments.author");

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(postDoc.comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
});

// like post
app.post("/post/:id/like", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" });
      }

      const userLiked = postDoc.likes.some((userId) => userId.equals(info.id));

      if (userLiked) {
        postDoc.likes.pull(info.id);
      } else {
        postDoc.likes.push(info.id);
      }

      await postDoc.save();

      res.json({ likes: postDoc.likes });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });
});

app.listen(PORT, () => console.log("Server Started"));


module.exports = app ;