<?php
require_once __DIR__ . '/comum.php';
exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $sql = 'SELECT c.id_carro, c.placa, c.chassi, c.cor, c.ano, c.valor, c.quilometragem, c.situacao,
                   mo.id_modelo, mo.nome AS modelo, ma.id_marca, ma.nome AS marca
            FROM tb_carro c
            INNER JOIN tb_modelo mo ON mo.id_modelo = c.id_modelo
            INNER JOIN tb_marca ma ON ma.id_marca = mo.id_marca
            ORDER BY ma.nome, mo.nome, c.placa';
    $acessorios = [];
    $vinculos = $pdo->query('SELECT ca.id_carro, a.nome FROM tb_carro_acessorio ca
                             INNER JOIN tb_acessorio a ON a.id_acessorio = ca.id_acessorio
                             ORDER BY a.nome')->fetchAll();
    foreach ($vinculos as $v) $acessorios[(int) $v['id_carro']][] = $v['nome'];

    $veiculos = array_map(fn($c) => [
        'id_carro' => (int) $c['id_carro'], 'placa' => $c['placa'], 'chassi' => $c['chassi'],
        'cor' => $c['cor'], 'ano' => (int) $c['ano'], 'valor' => (float) $c['valor'],
        'quilometragem' => (int) $c['quilometragem'], 'situacao' => $c['situacao'],
        'id_modelo' => (int) $c['id_modelo'], 'modelo' => $c['modelo'],
        'id_marca' => (int) $c['id_marca'], 'marca' => $c['marca'],
        'acessorios' => $acessorios[(int) $c['id_carro']] ?? [],
    ], $pdo->query($sql)->fetchAll());
    resposta(['sucesso' => true, 'veiculos' => $veiculos]);
}

if ($metodo === 'POST') {
    $d = corpoJson();
    $idModelo = filter_var($d['id_modelo'] ?? null, FILTER_VALIDATE_INT);
    $placa = strtoupper(str_replace(['-', ' '], '', trim((string) ($d['placa'] ?? ''))));
    $chassi = strtoupper(trim((string) ($d['chassi'] ?? '')));
    $cor = trim((string) ($d['cor'] ?? ''));
    $ano = filter_var($d['ano'] ?? null, FILTER_VALIDATE_INT);
    $km = filter_var($d['quilometragem'] ?? null, FILTER_VALIDATE_INT);
    $valor = filter_var($d['valor'] ?? null, FILTER_VALIDATE_FLOAT);
    $situacao = (string) ($d['situacao'] ?? '');

    if (!$idModelo || $idModelo < 1) erro('Selecione o modelo.');
    if (!preg_match('/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/', $placa)) erro('Placa inválida. Use o formato ABC1D23 ou ABC-1234.');
    if (!preg_match('/^[A-Z0-9]{17}$/', $chassi)) erro('O chassi deve ter 17 letras/números.');
    if ($cor === '' || mb_strlen($cor) > 30) erro('Informe a cor (até 30 caracteres).');
    if ($ano === false || $ano === null || $ano < 1900 || $ano > (int) date('Y') + 1) erro('Ano inválido.');
    if ($km === false || $km === null || $km < 0) erro('Quilometragem inválida.');
    if ($valor === false || $valor === null || $valor <= 0 || $valor > 99999999.99) erro('Valor inválido.');
    if (!in_array($situacao, ['novo', 'seminovo', 'levemente avariado', 'avariado'], true)) erro('Selecione a situação do veículo.');

    try {
        $pdo->prepare('INSERT INTO tb_carro (placa, chassi, cor, ano, valor, quilometragem, situacao, id_modelo)
                       VALUES (:placa, :chassi, :cor, :ano, :valor, :km, :situacao, :modelo)')
            ->execute([':placa' => $placa, ':chassi' => $chassi, ':cor' => $cor, ':ano' => $ano,
                       ':valor' => round($valor, 2), ':km' => $km, ':situacao' => $situacao, ':modelo' => $idModelo]);
        resposta(['sucesso' => true, 'mensagem' => 'Veículo cadastrado com sucesso!', 'id_carro' => (int) $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        $c = $e->errorInfo[1] ?? null;
        if ($c === 1062) erro('Já existe um veículo com essa placa ou chassi.', 409);
        if ($c === 1452) erro('O modelo selecionado não existe.');
        error_log($e->getMessage());
        erro('Erro ao cadastrar o veículo.', 500);
    }
}

erro('Método não permitido.', 405);
