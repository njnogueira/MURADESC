// src/api.js - Módulo de integração com a API REST do MURADESC

export async function buscarHealthCheck() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Servidor fora do ar");
  return res.json();
}

export async function buscarAvisos() {
  const res = await fetch("/api/avisos");
  if (!res.ok) throw new Error("Erro ao carregar avisos do mural");
  return res.json();
}

export async function buscarTurmasECategorias() {
  const res = await fetch("/api/turmas");
  if (!res.ok) throw new Error("Erro ao carregar turmas e categorias");
  return res.json();
}

export async function buscarUsuarios() {
  const res = await fetch("/api/usuarios");
  if (!res.ok) throw new Error("Erro ao carregar professores");
  return res.json();
}

export async function publicarAviso(dadosAviso) {
  const res = await fetch("/api/avisos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAviso),
  });

  if (!res.ok) {
    const erroJson = await res.json();
    throw new Error(erroJson.erro || "Falha ao publicar aviso");
  }
  return res.json();
}

export async function cadastrarUsuario(dadosUsuario) {
  const res = await fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosUsuario),
  });

  if (!res.ok) {
    const erroJson = await res.json();
    throw new Error(erroJson.erro || "Falha ao cadastrar professor");
  }
  return res.json();
}
