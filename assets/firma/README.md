# Firma de mail — Studio 74

Assets de la firma que usa el equipo para responder las consultas del sitio.
No los usa la web: son para Gmail (y a futuro para presupuestos o newsletters).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `studio74-logo-firma.png` | Badge negro con la marca en lima. **Se ve bien en fondo claro y en modo oscuro**, así que es el que va en la firma. |
| `studio74-mark-negro.png` | Marca oscura, fondo transparente. Para fondos claros, PDF y documentos. |
| `studio74-mark-blanco.png` | Marca clara, fondo transparente. Para fondos oscuros. |
| `firma-gmail.html` | La firma con el logo al costado. **Es la que se usa.** |
| `firma-gmail-apilada.html` | Respaldo: logo arriba y datos abajo. Usar solo si la otra se desarma. |

## Cómo ponerla en Gmail

1. Abrí `firma-gmail.html` en el navegador.
2. `Ctrl+A` y después `Ctrl+C`.
3. Gmail → Ajustes (⚙️) → *Ver toda la configuración* → **General** → **Firma** → *Crear nueva*.
4. `Ctrl+V`, ponele de nombre **Studio 74** y guardá los cambios (abajo de todo: *Guardar cambios*).
5. En esa misma pantalla elegí esa firma como predeterminada para **mails nuevos** y para
   **respuestas y reenvíos**.
6. Mandate un mail de prueba a vos mismo y miralo **desde el celular** y **en modo oscuro**.

> Cada persona del equipo cambia `Mariano` y su rol por los propios como una firma
> aparte: Gmail permite guardar varias.

> El logo se carga desde `https://studio74dev.com.ar/assets/firma/…`, así que aparece
> una vez que estos archivos estén en el repositorio pusheado. Si todavía no está,
> podés pegar la imagen a mano en el editor de la firma y Gmail la aloja.

## Por qué el badge y no la marca suelta

Un logo oscuro desaparece cuando el cliente lo lee en modo oscuro, y uno claro
desaparece sobre fondo blanco. El badge (fondo negro de la marca + trazo lima) es
visible en los dos casos y no depende de que el cliente de correo respete CSS.

Los PNG se generan desde los isotipos de `assets/isotipo/` con Pillow (máscara por
luminancia + color de marca aplicado por alpha).
