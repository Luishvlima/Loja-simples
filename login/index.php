<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('conexao.php');

$msg  = "";
$tipo = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $acao = $_POST['acao'] ?? '';

    if (empty($_POST['email'])) {
        $msg  = "Por favor preencha seu e-mail";
        $tipo = "erro";
    } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $msg  = "Digite um e-mail válido";
        $tipo = "erro";
    } elseif (empty($_POST['senha'])) {
        $msg  = "Por favor preencha sua senha";
        $tipo = "erro";
    } else {
        $email = $mysqli->real_escape_string($_POST['email']);

        if ($acao == 'entrar') {
            $senha_digitada = trim($_POST['senha']);
            $sql    = "SELECT * FROM usuarios WHERE email = '$email'";
            $result = $mysqli->query($sql);

            if (!$result) {
                $msg  = "Erro SQL: " . $mysqli->error;
                $tipo = "erro";
            } elseif ($result->num_rows == 0) {
                $msg  = "Usuário não encontrado!";
                $tipo = "erro";
            } else {
                $usuario = $result->fetch_assoc();
                if (password_verify($senha_digitada, $usuario['senha'])) {
                    header("Location: ../");
                    exit;
                } else {
                    $msg  = "Senha incorreta!";
                    $tipo = "erro";
                }
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
    <title>Technoblade — Entrar</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/login_e_cadastro.css">
</head>
<body>

    <header>
        <a href="../" class="logo">Technoblade</a>
        <div class="nav-links">
            <a href="../">Voltar</a>
            <a href="../cadastro/">Cadastre-se</a>
        </div>
    </header>

    <div class="container">
        <div class="caixa-formulario">

            <h2>Entrar</h2>
            <p>Acesse sua conta</p>

            <?php if (!empty($msg)): ?>
                <p style="color: <?= $tipo === 'erro' ? '#ff3c00' : '#DFFF00' ?>; font-size: 0.85rem; margin-bottom: 16px;">
                    <?= $msg ?>
                </p>
            <?php endif; ?>

            <form method="POST">

                <div class="campo">
                    <label>E-mail</label>
                    <input type="email" name="email" placeholder="Digite seu e-mail"
                           value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
                </div>

                <div class="campo">
                    <label>Senha</label>
                    <input type="password" name="senha" placeholder="Digite sua senha" required>
                </div>

                <button type="submit" name="acao" value="entrar" class="btn-acao">Entrar</button>

            </form>

            <div class="link-rodape">
                Não tem conta? <a href="../cadastro/">Cadastre-se</a>
            </div>

        </div>
    </div>

</body>
</html>