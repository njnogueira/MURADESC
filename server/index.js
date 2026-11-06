import "dotenv/config";
import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", async (req, res) => {
  let banco = "ok";
  try {
    await db.query("SELECT 1");
  } catch {
    banco = "sem conexão";
  }
  res.json({ status: "ok", banco, app: "MURADESC", hora: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
