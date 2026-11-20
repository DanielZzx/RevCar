-- RevCar - estrutura do banco de dados (MySQL/MariaDB)
-- Importe no phpMyAdmin ou execute:
--   mysql -u root -p < schema.sql
--
-- Depois de importar, crie o usuario administrador. O login precisa ser
-- exatamente "admin" (definido em api/comum.php). Gere o hash com:
--   php -r "echo password_hash('SUA_SENHA', PASSWORD_DEFAULT), PHP_EOL;"
-- e cadastre:
--   INSERT INTO tb_usuario (login, senha) VALUES ('admin', '<hash gerado>');

CREATE DATABASE IF NOT EXISTS bd_revendedoracarros CHARACTER SET utf8mb4;

USE bd_revendedoracarros;

-- 1. Tabela Trabalhe Conosco
CREATE TABLE IF NOT EXISTS tb_trabalheconosco (
    id_candidato INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(100),
    celular VARCHAR(11),
    cidade VARCHAR(20),
    estado VARCHAR(2),
    cargo_pretendido VARCHAR(20),
    link_linkedin VARCHAR(255)
);

-- 2. Tabela Usuario
CREATE TABLE IF NOT EXISTS tb_usuario (
    login VARCHAR(50) PRIMARY KEY,
    senha VARCHAR(255) NOT NULL
);

-- 3. Tabela Marca
CREATE TABLE IF NOT EXISTS tb_marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    UNIQUE KEY uq_marca_nome (nome)
);

-- 4. Tabela Acessorio
CREATE TABLE IF NOT EXISTS tb_acessorio (
    id_acessorio INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    UNIQUE KEY uq_acessorio_nome (nome)
);

-- 5. Tabela Modelo (excluir a marca exclui os modelos)
CREATE TABLE IF NOT EXISTS tb_modelo (
    id_modelo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    id_marca INT NOT NULL,
    UNIQUE KEY uq_modelo_marca (nome, id_marca),
    FOREIGN KEY (id_marca) REFERENCES tb_marca(id_marca) ON DELETE CASCADE
);

-- 6. Tabela Carro (excluir o modelo exclui os carros)
CREATE TABLE IF NOT EXISTS tb_carro (
    id_carro INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    chassi VARCHAR(30) NOT NULL,
    cor VARCHAR(30),
    ano INT,
    valor DECIMAL(10, 2),
    quilometragem INT,
    situacao ENUM('seminovo', 'novo', 'levemente avariado', 'avariado'),
    id_modelo INT NOT NULL,
    UNIQUE KEY uq_carro_placa (placa),
    UNIQUE KEY uq_carro_chassi (chassi),
    FOREIGN KEY (id_modelo) REFERENCES tb_modelo(id_modelo) ON DELETE CASCADE
);

-- 7. Tabela Carro_Acessorio (vinculo veiculo x acessorio)
CREATE TABLE IF NOT EXISTS tb_carro_acessorio (
    id_carro INT,
    id_acessorio INT,
    PRIMARY KEY (id_carro, id_acessorio),
    FOREIGN KEY (id_carro) REFERENCES tb_carro(id_carro) ON DELETE CASCADE,
    FOREIGN KEY (id_acessorio) REFERENCES tb_acessorio(id_acessorio)
);
