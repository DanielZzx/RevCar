<?php
// Configuração comum a todos os endpoints: CORS, sessão, JSON e permissões.
const ADMIN_LOGIN = 'admin';
const ORIGENS_PERMITIDAS = ['http://localhost:4200', 'http://127.0.0.1:4200'];

header('Content-Type: application/json; charset=utf-8');
$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origem, ORIGENS_PERMITIDAS, true)) {
    header('Access-Control-Allow-Origin: ' . $origem);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
session_start();

function resposta($dados, $status = 200) {
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function erro($mensagem, $status = 400) {
    resposta(['sucesso' => false, 'mensagem' => $mensagem], $status);
}

function corpoJson() {
    $dados = json_decode(file_get_contents('php://input'), true);
    return is_array($dados) ? $dados : [];
}

function ehAdmin() {
    return ($_SESSION['login'] ?? null) === ADMIN_LOGIN;
}

function exigirLogin() {
    if (empty($_SESSION['login'])) {
        erro('Faça login para continuar.', 401);
    }
}

function exigirAdmin() {
    exigirLogin();
    if (!ehAdmin()) {
        erro('Apenas o administrador pode executar esta ação.', 403);
    }
}

// Confere a senha de um hash; aceita senha antiga em texto puro apenas se NÃO for um hash.
function senhaConfere($digitada, $armazenada) {
    $armazenada = (string) $armazenada;
    if (password_get_info($armazenada)['algo']) {
        return password_verify($digitada, $armazenada);
    }
    return $armazenada !== '' && hash_equals($armazenada, $digitada);
}

// Confirma a senha do administrador logado (usada nas exclusões).
function confirmarSenhaAdmin($pdo, $senha) {
    exigirAdmin();
    if ($senha === '') {
        erro('Digite a senha do administrador para confirmar.', 400);
    }
    $stmt = $pdo->prepare('SELECT senha FROM tb_usuario WHERE login = :login LIMIT 1');
    $stmt->execute([':login' => $_SESSION['login']]);
    $admin = $stmt->fetch();
    if (!$admin || !senhaConfere($senha, $admin['senha'])) {
        erro('Senha do administrador incorreta. Nada foi excluído.', 401);
    }
}

require_once __DIR__ . '/conexao.php';
