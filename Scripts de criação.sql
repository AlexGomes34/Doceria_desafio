CREATE DATABASE db_doceria_ianes;
DROP DATABASE db_doceria_ianes;

CREATE TABLE tbl_usuario (
	id_usuario int primary key auto_increment not null,
    email TEXT not null,
    senha TEXT not null 
);

CREATE TABLE tbl_produto (
	id_produto int primary key auto_increment not null,
    nome TEXT not null,
    recheio TEXT not null,
    cobertura TEXT not null,
    massa TEXT not null,
    peso DOUBLE not null,
    porcoes INT not null,
    data_de_vencimento date not null,
    is_visivel tinyint(1) not null default 1,
    
    data_de_criacao datetime default current_timestamp
);

CREATE TABLE tbl_produto_excluido (
	id_produto_excluido int primary key auto_increment not null,
    id_usuario int null,
    id_produto int null,
    
    foreign key (id_usuario) references tbl_usuario(id_usuario) on delete cascade,
    foreign key (id_produto) references tbl_produto(id_produto) on delete cascade

);

-- INSERTS EXEMPLOS

INSERT INTO tbl_usuario (email, senha) VALUES 
('alex@gmail.com', '1234');

INSERT INTO tbl_produto (nome, recheio, cobertura, massa, peso, porcoes, data_de_vencimento) VALUES 
('Bolo de Morango Gourmet', 'Ninho com Morango', 'Chantininho', 'Pão de Ló', 1.2, 10, '2026-06-05'),
('Torta Holandesa', 'Creme Holandês', 'Ganache de Chocolate', 'Biscoito', 0.15, 1, '2026-05-30'),
('Bolo Supremo de Chocolate', 'Brigadeiro Tradicional', 'Granulado Belga', 'Chocolate', 2.0, 15, '2026-06-15');

create view vw_produtos_excluidos_por_usuario as
select
	pe.id_produto_excluido,
    u.id_usuario,
    u.email as email,
    p.id_produto,
    p.nome as nome_produto,
    p.recheio,
    p.cobertura,
    p.massa,
    p.peso,
    p.porcoes,
    p.data_de_vencimento,
    p.is_visivel,
    p.data_de_criacao as data_cadastro_produto
from
	tbl_produto_excluido pe
inner join
	tbl_usuario u on pe.id_usuario = u.id_usuario
inner join
	tbl_produto p on pe.id_produto = p.id_produto;