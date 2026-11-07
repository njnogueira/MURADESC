import { Router } from "express";
import db from "../db.js";
import { validarUsuario } from "../validacao.js";

const router = Router();
const CAMPOS = "id_usuario, nome, email, telefone, data_cadastro";

router.get("/", async (req, res) => {
  const [usuarios] = await db.execute(`SELECT ${CAMPOS} FROM usuario ORDER BY nome`);
  res.json(usuarios);
});

router.get("/:id", async (req, res) => {
  const [linhas] = await db.execute(`SELECT ${CAMPOS} FROM usuario WHERE id_usuario = ?`, [
    req.params.id,
  ]);
  if (linhas.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(linhas);
});

router.post("/", async (req, res) => {
  const erro = validarUsuario(req.body);
  if (erro) return res.status(400).json({ erro });
  const nome = req.body.nome.trim();
  const email = req.body.email.trim();
  const telefone = req.body.telefone || null;

  try {
    const [resultado] = await db.execute(
      "INSERT INTO usuario (nome, email, telefone) VALUES (?, ?, ?)",
      [nome, email, telefone],
    );
    res.status(201).json({ id_usuario: resultado.insertId, nome, email, telefone });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ erro: "E-mail já cadastrado" });
    throw e;
  }
});

router.put("/:id", async (req, res) => {
  const erro = validarUsuario(req.body);
  if (erro) return res.status(400).json({ erro });
  const nome = req.body.nome.trim();
  const email = req.body.email.trim();
  const telefone = req.body.telefone || null;

  try {
    const [resultado] = await db.execute(
      "UPDATE usuario SET nome = ?, email = ?, telefone = ? WHERE id_usuario = ?",
      [nome, email, telefone, req.params.id],
    );
    if (resultado.affectedRows === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json({ id_usuario: Number(req.params.id), nome, email, telefone });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ erro: "E-mail já cadastrado" });
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute("DELETE FROM usuario WHERE id_usuario = ?", [
      req.params.id,
    ]);
    if (resultado.affectedRows === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.status(204).end();
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .json({ erro: "Usuário possui avisos publicados e não pode ser excluído" });
    }
    throw e;
  }
});

export default router;
