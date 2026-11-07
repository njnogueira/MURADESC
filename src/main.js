// src/main.js - Controlador principal do DOM do MURADESC
import "./style.css";
import {
  buscarHealthCheck,
  buscarAvisos,
  buscarTurmasECategorias,
  buscarUsuarios,
  publicarAviso,
  cadastrarUsuario,
} from "./api.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <header>
    <h1>MURADESC · Mural Digital Escolar</h1>
    <p>Comunicação rápida e transparente com a comunidade escolar</p>
    <small id="status-api">Verificando conexão com a API...</small>
  </header>

  <nav>
    <button id="btn-mural" class="active">Mural de Avisos</button>
    <button id="btn-novo-aviso">+ Publicar Aviso</button>
    <button id="btn-professores">+ Professores</button>
  </nav>

  <div id="container-alertas"></div>

  <!-- Aba 1: Mural de Avisos -->
  <section id="aba-mural" class="aba-conteudo active">
    <div id="lista-avisos" class="grid-mural">Carregando avisos...</div>
  </section>

  <!-- Aba 2: Publicação de Avisos -->
  <section id="aba-novo-aviso" class="aba-conteudo">
    <form id="form-aviso">
      <h2>Publicar Comunicado Escolar</h2>
      
      <div class="field">
        <label for="select-autor">Autor (Professor/Gestor):</label>
        <select id="select-autor" required><option value="">Carregando...</option></select>
      </div>

      <div class="field">
        <label for="select-categoria">Categoria do Aviso:</label>
        <select id="select-categoria" required><option value="">Carregando...</option></select>
      </div>

      <div class="field">
        <label for="input-titulo">Título do Aviso:</label>
        <input type="text" id="input-titulo" placeholder="Ex: Simulado de Matemática" required maxlength="150" />
      </div>

      <div class="field">
        <label for="input-conteudo">Conteúdo / Descrição Detalhada:</label>
        <textarea id="input-conteudo" placeholder="Escreva o comunicado aqui..." required></textarea>
      </div>

      <div class="field">
        <label for="input-expiracao">Exibir até (Data de Expiração):</label>
        <input type="date" id="input-expiracao" required />
      </div>

      <div class="field">
        <label>Turmas de Destino:</label>
        <div id="checkboxes-turmas" class="checkbox-group">Carregando turmas...</div>
      </div>

      <div class="field">
        <label class="checkbox-label">
          <input type="checkbox" id="check-fixado" />
          Fixar aviso no topo do mural (Urgente)
        </label>
      </div>

      <button type="submit">Publicar no Mural</button>
    </form>
  </section>

  <!-- Aba 3: Cadastro de Professores -->
  <section id="aba-professores" class="aba-conteudo">
    <form id="form-usuario">
      <h2>Cadastrar Professor / Gestor</h2>
      
      <div class="field">
        <label for="input-nome-prof">Nome Completo:</label>
        <input type="text" id="input-nome-prof" placeholder="Ex: Profa. Maria Oliveira" required maxlength="150" />
      </div>

      <div class="field">
        <label for="input-email-prof">E-mail Institucional:</label>
        <input type="email" id="input-email-prof" placeholder="maria@escola.exemplo.com" required />
      </div>

      <div class="field">
        <label for="input-tel-prof">Telefone / WhatsApp (Opcional):</label>
        <input type="text" id="input-tel-prof" placeholder="(11) 97777-1111" />
      </div>

      <button type="submit">Cadastrar Autor</button>
    </form>
  </section>
`;

// Lógica das Abas
const btnMural = document.querySelector("#btn-mural");
const btnNovoAviso = document.querySelector("#btn-novo-aviso");
const btnProfessores = document.querySelector("#btn-professores");

const abaMural = document.querySelector("#aba-mural");
const abaNovoAviso = document.querySelector("#aba-novo-aviso");
const abaProfessores = document.querySelector("#aba-professores");

function alternarAba(botaoAtivo, abaAtiva) {
  [btnMural, btnNovoAviso, btnProfessores].forEach((b) => b.classList.remove("active"));
  [abaMural, abaNovoAviso, abaProfessores].forEach((a) => a.classList.remove("active"));
  botaoAtivo.classList.add("active");
  abaAtiva.classList.add("active");
}

btnMural.addEventListener("click", () => {
  alternarAba(btnMural, abaMural);
  carregarMural();
});
btnNovoAviso.addEventListener("click", () => alternarAba(btnNovoAviso, abaNovoAviso));
btnProfessores.addEventListener("click", () => alternarAba(btnProfessores, abaProfessores));

function exibirAlerta(mensagem, tipo = "sucesso") {
  const container = document.querySelector("#container-alertas");
  const div = document.createElement("div");
  div.className = `mensagem-alerta alerta-${tipo}`;
  div.textContent = mensagem;
  container.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// Prevenção contra XSS: Construção via createElement + textContent
function criarCardAviso(aviso) {
  const card = document.createElement("div");
  card.className = `card-aviso ${aviso.fixado ? "fixado" : ""}`;

  if (aviso.fixado) {
    const badge = document.createElement("span");
    badge.className = "badge-fixado";
    badge.textContent = "📌 AVISO FIXADO / IMPORTANTE";
    card.appendChild(badge);
  }

  const tagCategoria = document.createElement("div");
  tagCategoria.className = "categoria-tag";
  tagCategoria.style.backgroundColor = aviso.categoria.cor_hex || "#3B82F6";
  tagCategoria.textContent = aviso.categoria.nome;
  card.appendChild(tagCategoria);

  const titulo = document.createElement("h3");
  titulo.textContent = aviso.titulo;
  card.appendChild(titulo);

  const conteudo = document.createElement("p");
  conteudo.textContent = aviso.conteudo;
  card.appendChild(conteudo);

  const meta = document.createElement("div");
  meta.className = "meta-info";
  const turmasNomes = aviso.turmas.map((t) => t.nome_turma).join(", ");
  meta.textContent = `Publicado por ${aviso.autor.nome} | Turmas: ${turmasNomes} | Válido até: ${aviso.data_expiracao}`;
  card.appendChild(meta);

  return card;
}

async function carregarMural() {
  const listaAvisos = document.querySelector("#lista-avisos");
  listaAvisos.innerHTML = "Carregando avisos...";
  try {
    const avisos = await buscarAvisos();
    listaAvisos.innerHTML = "";
    if (avisos.length === 0) {
      listaAvisos.innerHTML = "<p>Nenhum aviso publicado no momento.</p>";
      return;
    }
    avisos.forEach((aviso) => {
      listaAvisos.appendChild(criarCardAviso(aviso));
    });
  } catch (err) {
    listaAvisos.innerHTML = `<p class="alerta-erro">${err.message}</p>`;
  }
}

async function carregarFormularios() {
  try {
    const { turmas, categorias } = await buscarTurmasECategorias();
    const usuarios = await buscarUsuarios();

    const selectAutor = document.querySelector("#select-autor");
    selectAutor.innerHTML = '<option value="">Selecione o autor...</option>';
    usuarios.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id_usuario;
      opt.textContent = u.nome;
      selectAutor.appendChild(opt);
    });

    const selectCat = document.querySelector("#select-categoria");
    selectCat.innerHTML = '<option value="">Selecione a categoria...</option>';
    categorias.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id_categoria;
      opt.textContent = c.nome;
      selectCat.appendChild(opt);
    });

    const containerTurmas = document.querySelector("#checkboxes-turmas");
    containerTurmas.innerHTML = "";
    turmas.forEach((t) => {
      const label = document.createElement("label");
      label.className = "checkbox-label";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "turmas";
      input.value = t.id_turma;

      label.appendChild(input);
      label.appendChild(document.createTextNode(t.nome_turma));
      containerTurmas.appendChild(label);
    });
  } catch (err) {
    exibirAlerta("Erro ao carregar dados dos formulários", "erro");
  }
}

document.querySelector("#form-aviso").addEventListener("submit", async (e) => {
  e.preventDefault();

  const turmasSelecionadas = Array.from(
    document.querySelectorAll('input[name="turmas"]:checked'),
  ).map((cb) => Number(cb.value));

  const dados = {
    id_usuario: Number(document.querySelector("#select-autor").value),
    id_categoria: Number(document.querySelector("#select-categoria").value),
    titulo: document.querySelector("#input-titulo").value,
    conteudo: document.querySelector("#input-conteudo").value,
    data_expiracao: document.querySelector("#input-expiracao").value,
    fixado: document.querySelector("#check-fixado").checked,
    turmas: turmasSelecionadas,
  };

  try {
    await publicarAviso(dados);
    exibirAlerta("Aviso publicado com sucesso no mural!");
    e.target.reset();
    alternarAba(btnMural, abaMural);
    carregarMural();
  } catch (err) {
    exibirAlerta(err.message, "erro");
  }
});

document.querySelector("#form-usuario").addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    nome: document.querySelector("#input-nome-prof").value,
    email: document.querySelector("#input-email-prof").value,
    telefone: document.querySelector("#input-tel-prof").value,
  };

  try {
    await cadastrarUsuario(dados);
    exibirAlerta("Professor/Gestor cadastrado com sucesso!");
    e.target.reset();
    carregarFormularios();
    alternarAba(btnNovoAviso, abaNovoAviso);
  } catch (err) {
    exibirAlerta(err.message, "erro");
  }
});

async function iniciar() {
  const statusApi = document.querySelector("#status-api");
  try {
    const health = await buscarHealthCheck();
    statusApi.textContent = `API: ${health.status} | Banco MariaDB/MySQL: ${health.banco}`;
  } catch {
    statusApi.textContent = "API offline (Execute 'vp run api')";
  }
  await carregarMural();
  await carregarFormularios();
}

iniciar();
