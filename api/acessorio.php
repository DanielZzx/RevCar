<?php
require_once __DIR__ . '/comum.php';
exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $lista = array_map(fn($a) => ['id_acessorio' => (int) $a['id_acessorio'], 'nome' => $a['nome']],
        $pdo->query('SELECT id_acessorio, nome FROM tb_acessorio ORDER BY nome')->fetchAll());
    resposta(['sucesso' => true, 'acessorios' => $lista]);
}

if ($metodo === 'POST') {
    $nome = trim((string) (corpoJson()['nome'] ?? ''));
    if ($nome === '') erro('O nome do acessório é obrigatório.');
    if (mb_strlen($nome) > 50) erro('O nome deve ter no máximo 50 caracteres.');
    try {
        $pdo->prepare('INSERT INTO tb_acessorio (nome) VALUES (:nome)')->execute([':nome' => $nome]);
        resposta(['sucesso' => true, 'mensagem' => 'Acessório cadastrado com sucesso!', 'id_acessorio' => (int) $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        if (($e->errorInfo[1] ?? null) === 1062) erro('Esse acessório já está cadastrado.', 409);
        error_log($e->getMessage());
        erro('Erro ao cadastrar o acessório.', 500);
    }
}

erro('Método não permitido.', 405);
