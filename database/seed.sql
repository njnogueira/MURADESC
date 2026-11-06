-- MURADESC · seed.sql
SET NAMES utf8mb4;
USE muradesc;

INSERT INTO categoria (nome) VALUES ('Alimento'), ('Higiene'), ('Vestuário');

INSERT INTO item (id_categoria, nome, unidade) VALUES
(1, 'Arroz 5 kg', 'pacote'),
(1, 'Feijão 1 kg', 'pacote'),
(2, 'Sabonete', 'unidade'),
(3, 'Agasalho', 'peça');

INSERT INTO doador (nome, email, telefone) VALUES
('Mercado Bom Preço', 'contato@bompreco.exemplo.com', '(11) 3333-1000'),
('Ana Souza', 'ana.souza@exemplo.com', '(11) 98888-1001');

INSERT INTO doacao (id_doador, data_doacao, observacao) VALUES
(1, '2026-10-05', 'Entrega feita pelo mercado');

INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES
(1, 1, 10),
(1, 2, 15);