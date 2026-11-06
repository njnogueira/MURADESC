-- MURADESC · schema.sql (Mural Digital Escolar)
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS muradesc;
CREATE DATABASE muradesc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muradesc;

-- 1. Tabela de Usuários (Professores/Gestores)
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Categorias dos Avisos
CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE,
  cor_hex VARCHAR(7) NOT NULL DEFAULT '#3B82F6'
);

-- 3. Tabela de Turmas Escolares
CREATE TABLE turma (
  id_turma INT AUTO_INCREMENT PRIMARY KEY,
  nome_turma VARCHAR(50) NOT NULL,
  ano_letivo INT NOT NULL
);

-- 4. Tabela Principal de Avisos
CREATE TABLE aviso (
  id_aviso INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_categoria INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  conteudo TEXT NOT NULL,
  data_publicacao DATE NOT NULL,
  data_expiracao DATE NOT NULL,
  fixado BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
  FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

-- 5. Tabela Associativa N:N (Aviso -> Múltiplas Turmas)
CREATE TABLE aviso_turma (
  id_aviso INT NOT NULL,
  id_turma INT NOT NULL,
  PRIMARY KEY (id_aviso, id_turma),
  FOREIGN KEY (id_aviso) REFERENCES aviso (id_aviso) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE
);