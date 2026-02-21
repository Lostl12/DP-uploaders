const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

const UPLOAD_DIR = path.join(__dirname, "upload");

// upload endpoint
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.photo) {
    return res.json({ ok: false, msg: "No image" });
  }

  const number = req.body.number;
  if (!number) return res.json({ ok: false, msg: "No number" });

  const file = req.files.photo;
  const filename = Date.now() + ".jpg";
  const filepath = path.join(UPLOAD_DIR, filename);

  file.mv(filepath);

  // later WhatsApp bot will use this image
  console.log("New DP request:", number, filename);

  res.json({ ok: true, msg: "Uploaded successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running..."));
