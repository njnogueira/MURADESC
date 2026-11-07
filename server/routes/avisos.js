import { Router } from "express";
import db from "../db.js";
import { validarAviso } from "../validacao.js";

const router = Router();

router.get("/", async (req, res) => {
  const [linhas] = await db.execute(`
    SELECT a.id_aviso, a.titulo, a.conteudo, a.data_publicacao, a.data_expiracao, a.fixado,
           c.nome AS categoria, c.cor_hex,
           u.id_usuario, u.nome AS autor,
           t.id_turma, t.nome_turma
    FROM aviso a
    JOIN categoria c ON c.id_categoria = a.id_categoria
    JOIN usuario u ON u.id_usuario = a.id_usuario
    JOIN aviso_turma at ON at.id_aviso = a.id_aviso
    JOIN turma t ON t.id_turma = at.id_turma
    ORDER BY a.fixado DESC, a.data_publicacao DESC, a.id_aviso DESC
  `);

  const avisosMap = new Map();
  for (const linha of linhas) {
    if (!avisosMap.has(linha.id_aviso)) {
      avisosMap.set(linha.id_aviso, {
        id_aviso: linha.id_aviso,
        titulo: linha.titulo,
        conteudo: linha.conteudo,
        data_publicacao: linha.data_publicacao,
        data_expiracao: linha.data_expiracao,
        fixado: Boolean(linha.fixado),
        categoria: { nome: linha.categoria, cor_hex: linha.cor_hex },
        autor: { id_usuario: linha.id_usuario, nome: linha.autor },
        turmas: [],
      });
    }
    avisosMap.get(linha.id_aviso).turmas.push({
      id_turma: linha.id_turma,
      nome_turma: linha.nome_turma,
    });
  }
  res.json([...avisosMap.values()]);
});

router.post("/", async (req, res) => {
  const erro = validarAviso(req.body);
  if (erro) return res.status(400).json({ erro });

  const { id_usuario, id_categoria, titulo, conteudo, data_expiracao, turmas } = req.body;
  const fixado = req.body.fixado || false;
  const data_publicacao = new Date().toISOString().slice(0, 10);

  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const [resAviso] = await conexao.execute(
      `INSERT INTO aviso (id_usuario, id_categoria, titulo, conteudo, data_publicacao, data_expiracao, fixado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        id_categoria,
        titulo.trim(),
        conteudo.trim(),
        data_publicacao,
        data_expiracao,
        fixado,
      ],
    );

    for (const idTurma of turmas) {
      await conexao.execute("INSERT INTO aviso_turma (id_aviso, id_turma) VALUES (?, ?)", [
        resAviso.insertId,
        idTurma,
      ]);
    }

    await conexao.commit();
    res
      .status(201)
      .json({ id_aviso: resAviso.insertId, titulo, data_publicacao, data_expiracao, turmas });
  } catch (e) {
    await conexao.rollback();
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Usuário, categoria ou turma não encontrada" });
    }
    throw e;
  } finally {
    conexao.release();
  }
});

export default router;
