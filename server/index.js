import "dotenv/config";
import express from "express";
import db from "./db.js";
import usuarios from "./routes/usuarios.js";
import turmas from "./routes/turmas.js";
import avisos from "./routes/avisos.js";

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

app.use("/api/usuarios", usuarios);
app.use("/api/turmas", turmas);
app.use("/api/avisos", avisos);

app.use((erro, req, res, _next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno no servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
