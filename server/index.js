const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");

app.use(cors());
app.use(express.json());

const PORT = 8080;

mongoose.connect("mongodb://127.0.0.1:27017/expense");

app.post("/api/register", async (req, res) => {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: `Duplicate Email` });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  console.log(req.body);
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });

    return res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
