<?php
require_once __DIR__ . '/comum.php';
exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $sql = 'SELECT ma.id_marca, ma.nome, mo.id_modelo, mo.nome AS modelo,
                   (SELECT COUNT(*) FROM tb_carro c WHERE c.id_modelo = mo.id_modelo) AS veiculos
            FROM tb_marca ma
            LEFT JOIN tb_modelo mo ON mo.id_marca = ma.id_marca
            ORDER BY ma.nome, mo.nome';
    $marcas = [];
    foreach ($pdo->query($sql)->fetchAll() as $l) {
        $id = (int) $l['id_marca'];
        if (!isset($marcas[$id])) {
            $marcas[$id] = ['id_marca' => $id, 'nome' => $l['nome'], 'modelos' => [], 'veiculos' => 0];
        }
        if ($l['id_modelo'] !== null) {
            $qtd = (int) $l['veiculos'];
            $marcas[$id]['modelos'][] = ['id_modelo' => (int) $l['id_modelo'], 'nome' => $l['modelo'], 'veiculos' => $qtd];
            $marcas[$id]['veiculos'] += $qtd;
        }
    }
    resposta(['sucesso' => true, 'admin' => ehAdmin(), 'marcas' => array_values($marcas)]);
}

if ($metodo === 'POST') {
    $nome = trim((string) (corpoJson()['nome'] ?? ''));
    if ($nome === '') erro('O nome da marca é obrigatório.');
    if (mb_strlen($nome) > 50) erro('O nome deve ter no máximo 50 caracteres.');
    try {
        $pdo->prepare('INSERT INTO tb_marca (nome) VALUES (:nome)')->execute([':nome' => $nome]);
        resposta(['sucesso' => true, 'mensagem' => 'Marca cadastrada com sucesso!', 'id_marca' => (int) $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        if (($e->errorInfo[1] ?? null) === 1062) erro('Essa marca já está cadastrada.', 409);
        error_log($e->getMessage());
        erro('Erro ao cadastrar marca.', 500);
    }
}

if ($metodo === 'DELETE') {
    exigirAdmin();
    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if (!$id || $id < 1) erro('Marca inválida.');
    confirmarSenhaAdmin($pdo, (string) (corpoJson()['senha'] ?? ''));

    try {
        $pdo->beginTransaction();
        $existe = $pdo->prepare('SELECT id_marca FROM tb_marca WHERE id_marca = :id FOR UPDATE');
        $existe->execute([':id' => $id]);
        if (!$existe->fetch()) { $pdo->rollBack(); erro('Marca não encontrada.', 404); }

        // Ordem: vínculos de acessórios -> veículos -> modelos -> marca (acessórios são preservados).
        $pdo->prepare('DELETE ca FROM tb_carro_acessorio ca
                       INNER JOIN tb_carro c ON c.id_carro = ca.id_carro
                       INNER JOIN tb_modelo mo ON mo.id_modelo = c.id_modelo
                       WHERE mo.id_marca = :id')->execute([':id' => $id]);
        $pdo->prepare('DELETE c FROM tb_carro c
                       INNER JOIN tb_modelo mo ON mo.id_modelo = c.id_modelo
                       WHERE mo.id_marca = :id')->execute([':id' => $id]);
        $pdo->prepare('DELETE FROM tb_modelo WHERE id_marca = :id')->execute([':id' => $id]);
        $pdo->prepare('DELETE FROM tb_marca WHERE id_marca = :id')->execute([':id' => $id]);
        $pdo->commit();
        resposta(['sucesso' => true, 'mensagem' => 'Marca excluída junto com seus modelos e veículos.']);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log($e->getMessage());
        erro('Não foi possível concluir a exclusão. Nada foi removido.', 500);
    }
}

erro('Método não permitido.', 405);
