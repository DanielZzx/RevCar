<?php
// Credenciais do MySQL.
// 1. Copie config.local.example.php para config.local.php e ajuste os dados.
// 2. Ou defina as variáveis de ambiente DB_HOST, DB_NAME, DB_USER e DB_PASSWORD.
// O arquivo config.local.php não é versionado.
$config = is_file(__DIR__ . '/config.local.php') ? require __DIR__ . '/config.local.php' : [];

$host = $config['host'] ?? (getenv('DB_HOST') ?: 'localhost');
$dbname = $config['dbname'] ?? (getenv('DB_NAME') ?: 'bd_revendedoracarros');
$user = $config['user'] ?? (getenv('DB_USER') ?: 'root');
$password = $config['password'] ?? (getenv('DB_PASSWORD') ?: '');
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['sucesso'=>false,'mensagem'=>'Erro ao conectar ao banco de dados.']);
    exit;
}
