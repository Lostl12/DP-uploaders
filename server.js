import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs-extra";
import path from "path";
import { Client, LocalAuth } from "whatsapp-web.js";

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

const UPLOAD_DIR = path.join(process.cwd(), "upload");
fs.ensureDirSync(UPLOAD_DIR);

let client;
let pendingDP = {}; // store uploaded file temporarily until code verified

// Start WhatsApp session for a number
app.post("/start-session", async (req, res) => {
  const number = req.body.number;
  const file = req.files?.photo;

  if (!number || !file) return res.json({ ok: false, msg: "Number + photo required" });

  const filename = Date.now() + path.extname(file.name);
  const filepath = path.join(UPLOAD_DIR, filename);
  await file.mv(filepath);

  pendingDP[number] = filepath;

  client = new Client({
    authStrategy: new LocalAuth({ clientId: `session-${number}` }),
    puppeteer: { headless: true }
  });

  client.on("qr", qr => {
    // Send QR to frontend for user to scan
    res.json({ ok: true, qr });
  });

  client.on("ready", async () => {
    try {
      const jid = number.includes("@c.us") ? number : number + "@c.us";
      await client.sendMessage(jid, { image: fs.createReadStream(filepath), caption: "Here is your full DP!" });
      fs.unlinkSync(filepath);
      client.destroy(); // unlink session automatically
    } catch (err) {
      console.error(err);
    }
  });

  client.initialize();
});
