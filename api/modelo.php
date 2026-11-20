<?php
require_once __DIR__ . '/comum.php';
exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $sql = 'SELECT mo.id_modelo, mo.nome, mo.id_marca, ma.nome AS marca
            FROM tb_modelo mo INNER JOIN tb_marca ma ON ma.id_marca = mo.id_marca';
    $params = [];
    if (isset($_GET['id_marca'])) {
        $idMarca = filter_var($_GET['id_marca'], FILTER_VALIDATE_INT);
        if ($idMarca === false) erro('Marca inválida.');
        $sql .= ' WHERE mo.id_marca = :id_marca';
        $params[':id_marca'] = $idMarca;
    }
    $stmt = $pdo->prepare($sql . ' ORDER BY ma.nome, mo.nome');
    $stmt->execute($params);
    $modelos = array_map(fn($m) => [
        'id_modelo' => (int) $m['id_modelo'], 'nome' => $m['nome'],
        'id_marca' => (int) $m['id_marca'], 'marca' => $m['marca'],
    ], $stmt->fetchAll());
    resposta(['sucesso' => true, 'modelos' => $modelos]);
}

if ($metodo === 'POST') {
    $d = corpoJson();
    $nome = trim((string) ($d['nome'] ?? ''));
    $idMarca = filter_var($d['id_marca'] ?? null, FILTER_VALIDATE_INT);
    if (!$idMarca || $idMarca < 1) erro('Selecione uma marca válida.');
    if ($nome === '') erro('O nome do modelo é obrigatório.');
    if (mb_strlen($nome) > 50) erro('O nome do modelo deve ter no máximo 50 caracteres.');
    try {
        $pdo->prepare('INSERT INTO tb_modelo (nome, id_marca) VALUES (:nome, :id_marca)')
            ->execute([':nome' => $nome, ':id_marca' => $idMarca]);
        resposta(['sucesso' => true, 'mensagem' => 'Modelo cadastrado com sucesso!', 'id_modelo' => (int) $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        $c = $e->errorInfo[1] ?? null;
        if ($c === 1062) erro('Esse modelo já está cadastrado para a marca selecionada.', 409);
        if ($c === 1452) erro('A marca selecionada não existe.');
        error_log($e->getMessage());
        erro('Erro ao cadastrar o modelo.', 500);
    }
}

if ($metodo === 'DELETE') {
    exigirAdmin();
    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if (!$id || $id < 1) erro('Modelo inválido.');
    confirmarSenhaAdmin($pdo, (string) (corpoJson()['senha'] ?? ''));

    try {
        $pdo->beginTransaction();
        $existe = $pdo->prepare('SELECT id_modelo FROM tb_modelo WHERE id_modelo = :id FOR UPDATE');
        $existe->execute([':id' => $id]);
        if (!$existe->fetch()) { $pdo->rollBack(); erro('Modelo não encontrado.', 404); }

        $pdo->prepare('DELETE ca FROM tb_carro_acessorio ca
                       INNER JOIN tb_carro c ON c.id_carro = ca.id_carro
                       WHERE c.id_modelo = :id')->execute([':id' => $id]);
        $pdo->prepare('DELETE FROM tb_carro WHERE id_modelo = :id')->execute([':id' => $id]);
        $pdo->prepare('DELETE FROM tb_modelo WHERE id_modelo = :id')->execute([':id' => $id]);
        $pdo->commit();
        resposta(['sucesso' => true, 'mensagem' => 'Modelo excluído junto com seus veículos.']);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log($e->getMessage());
        erro('Não foi possível concluir a exclusão. Nada foi removido.', 500);
    }
}

erro('Método não permitido.', 405);
