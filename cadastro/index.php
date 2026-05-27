<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('conexao.php');

$msg  = "";
$tipo = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (empty($_POST['nome'])) {
        $msg  = "Por favor preencha seu nome";
        $tipo = "erro";
    } elseif (empty($_POST['email'])) {
        $msg  = "Por favor preencha seu e-mail";
        $tipo = "erro";
    } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $msg  = "Digite um e-mail válido";
        $tipo = "erro";
    } elseif (empty($_POST['senha'])) {
        $msg  = "Por favor preencha sua senha";
        $tipo = "erro";
    } elseif ($_POST['senha'] !== $_POST['confirmar_senha']) {
        $msg  = "As senhas não coincidem";
        $tipo = "erro";
    } else {
        $email = $mysqli->real_escape_string($_POST['email']);
        $nome  = $mysqli->real_escape_string($_POST['nome']);

        $sql_check = "SELECT id FROM usuarios WHERE email = '$email'";
        $result    = $mysqli->query($sql_check);

        if (!$result) {
            $msg  = "Erro SQL: " . $mysqli->error;
            $tipo = "erro";
        } elseif ($result->num_rows > 0) {
            $msg  = "E-mail já cadastrado!";
            $tipo = "erro";
        } else {
            $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
            $sql   = "INSERT INTO usuarios (email, senha) VALUES ('$email', '$senha')";

            if ($mysqli->query($sql)) {
                $msg  = "Conta criada com sucesso! Faça login.";
                $tipo = "sucesso";
                $_POST = [];
            } else {
                $msg  = "Erro: " . $mysqli->error;
                $tipo = "erro";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technoblade — Cadastro</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/login_e_cadastro.css">
</head>
<body>

    <header>
        <a href="../" class="logo">Technoblade</a>
        <div class="nav-links">
            <a href="../">Voltar</a>
            <a href="../login/">Entrar</a>
        </div>
    </header>

    <div class="container">
        <div class="caixa-formulario">

            <h2>Cadastre-se</h2>
            <p>Crie sua conta para acessar ofertas exclusivas</p>

            <?php if (!empty($msg)): ?>
                <p style="color: <?= $tipo === 'erro' ? '#ff3c00' : '#DFFF00' ?>; font-size: 0.85rem; margin-bottom: 16px;">
                    <?= $msg ?>
                </p>
            <?php endif; ?>

            <form method="POST">

                <div class="campo">
                    <label>Nome</label>
                    <input type="text" name="nome" placeholder="Digite seu nome completo"
                           value="<?= htmlspecialchars($_POST['nome'] ?? '') ?>" required>
                </div>

                <div class="campo">
                    <label>E-mail</label>
                    <input type="email" name="email" placeholder="Ex: usuario@gmail.com"
                           value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
                </div>

                <div class="campo">
                    <label>Senha</label>
                    <input type="password" name="senha" placeholder="Crie uma senha" required>
                </div>

                <div class="campo">
                    <label>Confirmar senha</label>
                    <input type="password" name="confirmar_senha" placeholder="Confirme sua senha" required>
                </div>

                <button type="submit" class="btn-acao">Cadastrar</button>

            </form>

            <div class="link-rodape">
                Já tem conta? <a href="../login/">Entrar</a>
            </div>

        </div>
    </div>

</body>
</html>