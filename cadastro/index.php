<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include('conexao.php');

$msg  = "";
$tipo = "";

if (!empty($_SESSION['usuario'])) {
    header('Location: ../');
    exit;
}

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
            $sql   = "INSERT INTO usuarios (nome, email, senha) VALUES ('$nome', '$email', '$senha')";

            if ($mysqli->query($sql)) {
                $novoId = $mysqli->insert_id;
                $_SESSION['usuario'] = [
                    'id' => $novoId,
                    'nome' => $nome,
                    'email' => $email
                ];
                header('Location: ../');
                exit;
            } else {
                $msg  = "Erro: " . $mysqli->error;
                $tipo = "erro";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technoblade - Cadastro</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/barra_nav.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/botao.css">
    <link rel="stylesheet" href="../css/login_e_cadastro.css">
    <link rel="stylesheet" href="../css/rodape.css">
    <link rel="stylesheet" href="../css/auth_menu.css">
</head>


<!-- 
  Essa é uma separação visual pois
  tenho Problemas com a visão
-->


<body>

<!-- 
  Essa é uma separação visual pois
  tenho Problemas com a visão
-->

    <header>
        <nav class="barra-nav">
            <a href="../" class="barra-nav__logo">Technoblade</a>
            <div class="barra-nav__acoes">
                <a href="../login/" class="botao botao--entrar">Entrar</a>
                <a id="btnVoltar"class="botao botao--entrar">Voltar</a>
            </div>
        </nav>
    </header>

<!-- 
  Essa é uma separação visual pois
  tenho Problemas com a visão
-->

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

    <footer id="rodape">
        <div class="rodape__grade">
            <div class="rodape__coluna">
                <div class="rodape__marca">Technoblade</div>
                <p class="rodape__sobre">Especialistas em periféricos gamers, computadores e acessórios de alta performance.</p>
            </div>
            <div class="rodape__coluna">
                <div class="rodape__titulo">Links Rápidos</div>
                <ul class="rodape__lista">
                    <li><a href="../"            class="rodape__link">Início</a></li>
                    <li><a href="../#produtos"   class="rodape__link">Produtos</a></li>
                    <li><a href="../#categorias" class="rodape__link">Categorias</a></li>
                    <li><a href="../games/"                class="rodape__link">Games</a></li>
                    <li><a href="../computadores/"         class="rodape__link">Computadores</a></li>
                    <li><a href="../celular/"              class="rodape__link">Celulares</a></li>
                </ul>
            </div>
            <div class="rodape__coluna">
                <div class="rodape__titulo">Siga-nos</div>
                <div class="rodape__redes">
                    <a href="#" class="rodape__rede">Facebook</a>
                    <a href="#" class="rodape__rede">X (Twitter)</a>
                    <a href="#" class="rodape__rede">Instagram</a>
                    <a href="#" class="rodape__rede">YouTube</a>
                </div>
            </div>
        </div>
        <div class="rodape__base">
            <span>© 2026 Technoblade. Todos os direitos reservados.</span>
        </div>
    </footer>

    <script>
        document.getElementById("btnVoltar").addEventListener("click", () => {
            history.back();
        });
    </script>
    <script src="../js/auth-ui.js?v=1"></script>

</body>
</html>
