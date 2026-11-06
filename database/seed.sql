-- MURADESC · seed.sql
SET NAMES utf8mb4;
USE muradesc;

INSERT INTO categoria (nome, cor_hex) VALUES 
('Geral', '#3B82F6'),
('Provas & Trabalhos', '#EF4444'),
('Eventos & Feiras', '#10B981'),
('Reuniões', '#F59E0B');

INSERT INTO turma (nome_turma, ano_letivo) VALUES
('6º Ano A', 2026),
('7º Ano B', 2026),
('8º Ano A', 2026),
('9º Ano A', 2026);

INSERT INTO usuario (nome, email, telefone) VALUES
('Profa. Maria Oliveira', 'maria.oliveira@escola.exemplo.com', '(11) 97777-1111'),
('Prof. João Santos', 'joao.santos@escola.exemplo.com', '(11) 98888-2222');

INSERT INTO aviso (id_usuario, id_categoria, titulo, conteudo, data_publicacao, data_expiracao, fixado) VALUES
(1, 2, 'Simulado Geral do 4º Bimestre', 'O simulado ocorrerá na próxima quinta-feira no horário normal de aula.', '2026-11-06', '2026-11-20', TRUE);

INSERT INTO aviso_turma (id_aviso, id_turma) VALUES
(1, 3),
(1, 4);