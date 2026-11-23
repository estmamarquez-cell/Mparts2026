<?php
// Fotos de productos: archivo assets/img/productos/<CODIGO>.jpg|png|webp  (ej. A001.jpg)
const FOTO_EXT = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
function foto_dir(): string { return __DIR__ . '/../assets/img/productos/'; }
function foto_codigo(string $c): string { return preg_replace('/[^A-Za-z0-9_-]/', '', $c); }

// Devuelve la ruta relativa a la raíz del sitio, o null si el producto no tiene foto.
function foto(string $codigo): ?string {
    $c = foto_codigo($codigo); if ($c === '') return null;
    foreach (FOTO_EXT as $e) {
        $f = foto_dir() . $c . '.' . $e;
        if (is_file($f)) return 'assets/img/productos/' . $c . '.' . $e . '?v=' . filemtime($f);
    }
    return null;
}
function borrar_fotos(string $codigo): void {
    $c = foto_codigo($codigo); if ($c === '') return;
    foreach (FOTO_EXT as $e) { $f = foto_dir() . $c . '.' . $e; if (is_file($f)) @unlink($f); }
}
// Guarda la foto subida desde el panel (reemplaza la anterior).
function guardar_foto(string $codigo, array $f): void {
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return;
    if ($f['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('El servidor no pudo recibir el archivo (código ' . $f['error'] . ').');
    if ($f['size'] > 3 * 1024 * 1024) throw new RuntimeException('La imagen supera los 3 MB.');
    $info = @getimagesize($f['tmp_name']);
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$info['mime'] ?? ''] ?? null;
    if (!$ext) throw new RuntimeException('Formato no permitido. Usa JPG, PNG o WEBP.');
    $c = foto_codigo($codigo); if ($c === '') throw new RuntimeException('Código de producto inválido.');
    if (!is_dir(foto_dir())) @mkdir(foto_dir(), 0755, true);
    borrar_fotos($c);
    if (!move_uploaded_file($f['tmp_name'], foto_dir() . $c . '.' . $ext)) throw new RuntimeException('No se pudo guardar la imagen en el servidor.');
}
