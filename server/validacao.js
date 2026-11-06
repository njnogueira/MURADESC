const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function validarUsuario(dados = {}) {
  const { nome, email, telefone } = dados;
  if (typeof nome !== "string" || nome.trim() === "") return "Nome é obrigatório";
  if (nome.length > 150) return "Nome deve ter no máximo 150 caracteres";
  if (!email || !FORMATO_EMAIL.test(email)) return "E-mail válido é obrigatório";
  if (telefone && String(telefone).length > 20) return "Telefone deve ter no máximo 20 caracteres";
  return null;
}

export function validarAviso(dados = {}) {
  const { id_usuario, id_categoria, titulo, conteudo, data_expiracao, turmas } = dados;
  if (!Number.isInteger(id_usuario)) return "Selecione um autor/professor válido";
  if (!Number.isInteger(id_categoria)) return "Selecione uma categoria válida";
  if (typeof titulo !== "string" || titulo.trim() === "") return "Título é obrigatório";
  if (titulo.length > 150) return "Título deve ter no máximo 150 caracteres";
  if (typeof conteudo !== "string" || conteudo.trim() === "") return "Conteúdo é obrigatório";
  if (!FORMATO_DATA.test(data_expiracao ?? ""))
    return "Data de expiração deve estar no formato AAAA-MM-DD";
  if (!Array.isArray(turmas) || turmas.length === 0)
    return "Selecione ao menos uma turma de destino";

  for (const idTurma of turmas) {
    if (!Number.isInteger(idTurma)) return "Cada turma deve ser identificada por um número inteiro";
  }

  if (new Set(turmas).size !== turmas.length)
    return "A mesma turma foi selecionada mais de uma vez";
  return null;
}
