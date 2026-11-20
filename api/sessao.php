<?php
require_once __DIR__ . '/comum.php';
resposta([
    'sucesso' => true,
    'logado'  => !empty($_SESSION['login']),
    'login'   => $_SESSION['login'] ?? null,
    'admin'   => ehAdmin(),
]);
