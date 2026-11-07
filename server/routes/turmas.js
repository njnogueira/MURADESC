import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const [turmas] = await db.execute(
    "SELECT id_turma, nome_turma, ano_letivo FROM turma ORDER BY nome_turma",
  );
  const [categorias] = await db.execute(
    "SELECT id_categoria, nome, cor_hex FROM categoria ORDER BY nome",
  );
  res.json({ turmas, categorias });
});

export default router;
