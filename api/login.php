<?php
require_once __DIR__ . '/comum.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') erro('Método não permitido.', 405);

$d = corpoJson();
$login = trim((string) ($d['login'] ?? ''));
$senha = (string) ($d['senha'] ?? '');
if ($login === '' || $senha === '') erro('Informe login e senha.');

$stmt = $pdo->prepare('SELECT login, senha FROM tb_usuario WHERE login = :login LIMIT 1');
$stmt->execute([':login' => $login]);
$usuario = $stmt->fetch();

if (!$usuario || !senhaConfere($senha, $usuario['senha'])) {
    erro('Login ou senha incorretos.', 401);
}

// Converte senhas antigas em texto puro para hash.
if (!password_get_info((string) $usuario['senha'])['algo']) {
    $pdo->prepare('UPDATE tb_usuario SET senha = :s WHERE login = :l')
        ->execute([':s' => password_hash($senha, PASSWORD_DEFAULT), ':l' => $usuario['login']]);
}

session_regenerate_id(true);
$_SESSION['login'] = $usuario['login'];

resposta([
    'sucesso'  => true,
    'mensagem' => 'Login realizado com sucesso!',
    'login'    => $usuario['login'],
    'admin'    => ehAdmin(),
]);
