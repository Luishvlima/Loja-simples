<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['carrinho']) || !is_array($_SESSION['carrinho'])) {
    $_SESSION['carrinho'] = [];
}

function parse_preco($preco)
{
    if (!$preco) {
        return 0.0;
    }

    $normalizado = preg_replace('/[R$\s.]/', '', $preco);
    $normalizado = str_replace(',', '.', $normalizado);

    return (float) $normalizado;
}

function resposta($ok, $mensagem = '')
{
    $carrinho = $_SESSION['carrinho'];
    $totalItens = 0;
    $totalValor = 0.0;

    foreach ($carrinho as $item) {
        $qtd = isset($item['qtd']) ? (int) $item['qtd'] : 0;
        $totalItens += $qtd;
        $preco = isset($item['produto']['preco']) ? parse_preco($item['produto']['preco']) : 0.0;
        $totalValor += $preco * $qtd;
    }

    echo json_encode([
        'ok' => $ok,
        'mensagem' => $mensagem,
        'carrinho' => $carrinho,
        'total_itens' => $totalItens,
        'total_valor' => $totalValor,
        'usuario' => $_SESSION['usuario'] ?? null,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$entradaBruta = file_get_contents('php://input');
$entrada = json_decode($entradaBruta, true);
if (!is_array($entrada)) {
    $entrada = $_POST;
}

$acao = $entrada['acao'] ?? 'get';
$slug = isset($entrada['slug']) ? trim((string) $entrada['slug']) : '';
$quantidade = isset($entrada['quantidade']) ? (int) $entrada['quantidade'] : 1;
$produto = isset($entrada['produto']) && is_array($entrada['produto']) ? $entrada['produto'] : [];

switch ($acao) {
    case 'get':
        resposta(true);

    case 'add':
        if ($slug === '') {
            resposta(false, 'Produto inválido.');
        }

        if ($quantidade < 1) {
            $quantidade = 1;
        }

        if (!isset($_SESSION['carrinho'][$slug])) {
            $_SESSION['carrinho'][$slug] = [
                'produto' => $produto,
                'qtd' => 0,
            ];
        }

        if (empty($_SESSION['carrinho'][$slug]['produto']) && !empty($produto)) {
            $_SESSION['carrinho'][$slug]['produto'] = $produto;
        }

        $_SESSION['carrinho'][$slug]['qtd'] = (int) $_SESSION['carrinho'][$slug]['qtd'] + $quantidade;
        resposta(true, 'Produto adicionado ao carrinho.');

    case 'update':
        if ($slug === '') {
            resposta(false, 'Produto inválido.');
        }

        if ($quantidade <= 0) {
            unset($_SESSION['carrinho'][$slug]);
            resposta(true, 'Produto removido do carrinho.');
        }

        if (!isset($_SESSION['carrinho'][$slug])) {
            $_SESSION['carrinho'][$slug] = [
                'produto' => $produto,
                'qtd' => 0,
            ];
        }

        if (empty($_SESSION['carrinho'][$slug]['produto']) && !empty($produto)) {
            $_SESSION['carrinho'][$slug]['produto'] = $produto;
        }

        $_SESSION['carrinho'][$slug]['qtd'] = $quantidade;
        resposta(true, 'Quantidade atualizada.');

    case 'remove':
        if ($slug !== '') {
            unset($_SESSION['carrinho'][$slug]);
        }
        resposta(true, 'Produto removido.');

    case 'clear':
        $_SESSION['carrinho'] = [];
        resposta(true, 'Carrinho limpo.');

    default:
        resposta(false, 'Ação inválida.');
}
