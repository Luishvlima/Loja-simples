<?php
$usuario  = 'root';
$senha    = '';
$database = 'DiogoMotaAraujoAlves';
$host     = 'localhost';

$mysqli = new mysqli($host, $usuario, $senha, $database);

if ($mysqli->error) {
    die("Falha ao conectar: " . $mysqli->error);
}
?>