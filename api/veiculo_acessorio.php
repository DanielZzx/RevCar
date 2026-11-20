<?php
require_once __DIR__ . '/comum.php';
exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

// GET ?id_carro=N -> ids dos acessórios vinculados ao veículo
if ($metodo === 'GET') {
    $idCarro = filter_var($_GET['id_carro'] ?? null, FILTER_VALIDATE_INT);
    if (!$idCarro || $idCarro < 1) erro('Veículo inválido.');
    $stmt = $pdo->prepare('SELECT id_acessorio FROM tb_carro_acessorio WHERE id_carro = :id');
    $stmt->execute([':id' => $idCarro]);
    resposta(['sucesso' => true, 'acessorios' => array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN))]);
}

// POST {id_carro, acessorios:[ids]} -> substitui os vínculos do veículo
if ($metodo === 'POST') {
    $d = corpoJson();
    $idCarro = filter_var($d['id_carro'] ?? null, FILTER_VALIDATE_INT);
    if (!$idCarro || $idCarro < 1) erro('Selecione um veículo.');
    $ids = [];
    foreach ((array) ($d['acessorios'] ?? []) as $a) {
        $i = filter_var($a, FILTER_VALIDATE_INT);
        if (!$i || $i < 1) erro('Acessório inválido.');
        $ids[$i] = $i;
    }

    try {
        $pdo->beginTransaction();
        $existe = $pdo->prepare('SELECT id_carro FROM tb_carro WHERE id_carro = :id FOR UPDATE');
        $existe->execute([':id' => $idCarro]);
        if (!$existe->fetch()) { $pdo->rollBack(); erro('Veículo não encontrado.', 404); }

        $pdo->prepare('DELETE FROM tb_carro_acessorio WHERE id_carro = :id')->execute([':id' => $idCarro]);
        $ins = $pdo->prepare('INSERT INTO tb_carro_acessorio (id_carro, id_acessorio) VALUES (:c, :a)');
        foreach ($ids as $i) $ins->execute([':c' => $idCarro, ':a' => $i]);
        $pdo->commit();
        resposta(['sucesso' => true, 'mensagem' => 'Acessórios do veículo salvos com sucesso!']);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        if (($e->errorInfo[1] ?? null) === 1452) erro('Um dos acessórios selecionados não existe.');
        error_log($e->getMessage());
        erro('Erro ao salvar os acessórios do veículo.', 500);
    }
}

erro('Método não permitido.', 405);
