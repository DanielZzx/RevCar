<?php
require_once __DIR__ . '/comum.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') erro('Método não permitido.', 405);
$_SESSION = [];
session_destroy();
resposta(['sucesso' => true, 'mensagem' => 'Sessão encerrada.']);
