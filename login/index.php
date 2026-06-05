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
                    $_SESSION['usuario'] = [
                        'id' => $usuario['id'],
                        'nome' => $usuario['nome'],
                        'email' => $usuario['email']
                    ];
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
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technoblade - Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/barra_nav.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/botao.css">
    <link rel="stylesheet" href="../css/login_e_cadastro.css">
    <link rel="stylesheet" href="../css/rodape.css">
    <link rel="stylesheet" href="../css/auth_menu.css">
</head>
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

<body>
  <section class="secao" id="login">
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
    function scrollProdutos(valor) {
      const container = document.getElementById("listaProdutos");
      container.scrollLeft += valor;
    }
  </script>
  <script src="../js/busca.js"></script>
  <script src="../js/detectar.js?v=2"></script>
  <script src="../js/auth-ui.js?v=1"></script>
  <script src="../js/carrinho.js"></script>
  <script src="../js/produtos.js"></script>

</body>
</html>

            