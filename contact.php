<?php
/**
 * Studio 74 — Endpoint del formulario de contacto.
 *
 * Recibe el POST de la landing y envía el mensaje por mail() al buzón
 * TO_EMAIL. Funciona con PHP 7.4+ (probar con 8.x en hosting).
 *
 * EN HOSTINGER:
 *   1. Subir este archivo junto al resto del sitio a public_html/
 *   2. Crear el buzón no-reply@studio74.com.ar en hPanel → Emails
 *      (el remitente tiene que ser de tu dominio, ver FROM_EMAIL)
 *   3. Listo: el formulario de la landing pasa a modo PHP solo, sin
 *      tocar el JavaScript (si contact.php no existe —por ejemplo en
 *      GitHub Pages— el front cae en el relay de Web3Forms y, si ese
 *      tampoco responde, en el fallback mailto:).
 *
 * Los mensajes llegan a TO_EMAIL (el Gmail del estudio).
 *
 * Si mail() estuviera deshabilitado en tu hosting, la alternativa es
 * PHPMailer apuntando al SMTP de Hostinger (las credenciales del
 * buzón quedan en hPanel → Email Accounts).
 *
 * Respuesta siempre en JSON: { "ok": true|false, "message": "..." }
 */

// ── Configuración ────────────────────────────────────────────────────────────
const TO_EMAIL      = 'studio74dev@gmail.com';

// Remitente. Tiene que ser un buzón de TU dominio: si se envía "desde"
// Gmail, Gmail lo manda a spam (este servidor no está autorizado a mandar
// en nombre de gmail.com). Cuando el dominio esté creado, dejá acá
// no-reply@studio74.com.ar y creá ese buzón en hPanel → Emails.
const FROM_EMAIL    = 'no-reply@studio74.com.ar';
const FROM_NAME     = 'Studio 74 Web';
const SUBJECT_PRE   = 'Consulta desde la web';
const MAX_PER_HOUR  = 5;      // envíos máximos por IP por hora
const LIMITS        = [       // longitudes máximas en caracteres
    'name'    => 120,
    'email'   => 254,
    'service' => 80,
    'message' => 6000,
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function respond(bool $ok, int $code, string $message = ''): void
{
    http_response_code($code);
    $out = ['ok' => $ok];
    if ($message !== '') {
        $out['message'] = $message;
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ulen(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ── Solo POST ────────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 405, 'Método no permitido');
}

// ── Honeypot: los bots completan el campo oculto → éxito falso ──────────────
if (trim((string) ($_POST['company'] ?? '')) !== '') {
    respond(true, 200);
}

// ── Trampa de tiempo (solo para peticiones del JS) ──────────────────────────
$wantsJson = strpos(strtolower((string) ($_SERVER['HTTP_ACCEPT'] ?? '')), 'application/json') !== false;
$started   = (int) ($_POST['started'] ?? 0);
$age       = time() - $started;

if ($wantsJson && ($started <= 0 || $age < 3 || $age > 604800)) {
    // Sin timestamp válido o recién abierto: no es una interacción humana.
    respond(false, 400, 'La sesión expiró. Recargue la página.');
}

// ── Limpieza (sin CR/LF: protege contra header injection) ───────────────────
$clean = static function ($v): string {
    return trim(preg_replace('/[\r\n\t]+/u', ' ', (string) $v) ?? '');
};

$name    = $clean($_POST['name'] ?? '');
$email   = $clean($_POST['email'] ?? '');
$service = $clean($_POST['service'] ?? '');
$message = $clean($_POST['message'] ?? '');

// ── Validación ──────────────────────────────────────────────────────────────
if ($name === '' || ulen($name) > LIMITS['name']) {
    respond(false, 400, 'Revise el campo nombre.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || ulen($email) > LIMITS['email']) {
    respond(false, 400, 'Revise el campo correo electrónico.');
}
if ($service === '' || ulen($service) > LIMITS['service']) {
    respond(false, 400, 'Seleccione un tipo de consulta.');
}
if ($message === '' || ulen($message) > LIMITS['message']) {
    respond(false, 400, 'Cuéntenos un poco más sobre su proyecto.');
}

// ── Rate limit por IP: MAX_PER_HOUR envíos por hora (archivo en tmp) ────────
$ip           = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$now          = time();
$throttleFile = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'studio74_contact_throttle.json';
$fh           = @fopen($throttleFile, 'c+');

if ($fh !== false && flock($fh, LOCK_EX)) {
    $all = json_decode((string) stream_get_contents($fh), true);
    if (!is_array($all)) {
        $all = [];
    }

    $mine = [];
    foreach (is_array($all[$ip] ?? null) ? $all[$ip] : [] as $t) {
        if ($now - (int) $t < 3600) {
            $mine[] = (int) $t;
        }
    }

    if (count($mine) >= MAX_PER_HOUR) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(false, 429, 'Demasiados envíos seguidos. Intente nuevamente en unos minutos.');
    }

    $mine[]     = $now;
    $all[$ip]   = $mine;

    // Poda: entradas de más de 24 h, y tope de IPs en el archivo.
    foreach ($all as $k => $times) {
        if (!is_array($times) || $times === [] || $now - (int) max($times) > 86400) {
            unset($all[$k]);
        }
    }
    if (count($all) > 100) {
        $all = array_slice($all, -100, null, true);
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($all));
    fflush($fh);
    flock($fh, LOCK_UN);
}
if ($fh !== false) {
    fclose($fh);
}

// ── Armado del mail ─────────────────────────────────────────────────────────
$from    = FROM_NAME . ' <' . FROM_EMAIL . '>';
$subject = SUBJECT_PRE . ' — ' . $service;

$body  = "Consulta desde la web de Studio 74\n";
$body .= str_repeat('=', 44) . "\n\n";
$body .= "Nombre:            {$name}\n";
$body .= "Email:             {$email}\n";
$body .= "Tipo de proyecto:  {$service}\n";
$body .= "Fecha:             " . date('d/m/Y H:i (T)') . "\n\n";
$body .= "Mensaje:\n{$message}\n";

$headers  = 'From: ' . $from . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
$headers .= 'X-Mailer: Studio74-Contact';

// Asunto UTF-8 codificado según RFC 2047 (tildes y ñ se ven bien en todos los clientes).
$subjectEnc  = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// El sobre (-f) va con el mismo remitente del dominio: ayuda a que Gmail
// no lo tome como spam (SPF alineado).
$sent = @mail(TO_EMAIL, $subjectEnc, $body, $headers, '-f' . FROM_EMAIL);

if (!$sent) {
    // El front ofrece el fallback mailto: al recibir este error.
    respond(false, 500, 'No se pudo enviar el mensaje.');
}

respond(true, 200);
