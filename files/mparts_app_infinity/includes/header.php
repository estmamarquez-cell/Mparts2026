<?php require_once __DIR__ . '/../config.php'; require_once __DIR__ . '/fotos.php'; $titulo = $titulo ?? 'M-PARTS | Repuestos para motos'; ?>
<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= h($titulo) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="assets/img/logo.jpg"><meta name="theme-color" content="#0b0c0f">
<link rel="stylesheet" href="assets/css/style.css?v=27">
</head><body>
<header class="nav"><div class="wrap nav-in">
  <a class="logo" href="index.php"><b>M-</b>PARTS</a>
  <form class="search" action="index.php" method="get">
    <input name="q" value="<?= h($_GET['q'] ?? '') ?>" placeholder="Buscar por nombre, código o categoría…" aria-label="Buscar productos">
    <button>Buscar</button>
  </form>
  <a class="cart-link" href="carrito.php"><svg class="cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H7"/><circle cx="10" cy="19" r="1.4"/><circle cx="18" cy="19" r="1.4"/></svg>Ver carrito <b id="cart-count">0</b></a>
</div></header>
  <div class="snowfall" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
