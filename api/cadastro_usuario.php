<?php
require_once __DIR__ . '/comum.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') erro('Método não permitido.', 405);

$d = corpoJson();
$login = trim((string) ($d['login'] ?? ''));
$senha = (string) ($d['password'] ?? '');

if ($login === '' || $senha === '') erro('Todos os campos são obrigatórios.');
if (mb_strlen($login) > 50) erro('O login deve ter no máximo 50 caracteres.');
if (mb_strlen($senha) < 5) erro('A senha deve ter no mínimo 5 caracteres.');
if (strlen($senha) > 72) erro('A senha deve ter no máximo 72 caracteres.');

try {
    $pdo->prepare('INSERT INTO tb_usuario (login, senha) VALUES (:l, :s)')
        ->execute([':l' => $login, ':s' => password_hash($senha, PASSWORD_DEFAULT)]);
    resposta(['sucesso' => true, 'mensagem' => 'Usuário cadastrado com sucesso!'], 201);
} catch (PDOException $e) {
    if (($e->errorInfo[1] ?? null) === 1062) erro('Esse login já está em uso.', 409);
    error_log($e->getMessage());
    erro('Erro ao cadastrar o usuário.', 500);
}
