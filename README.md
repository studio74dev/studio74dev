# Studio 74 — sitio

Sitio del estudio: **[studio74dev.github.io](https://studio74dev.github.io/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura de archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa (ver secciones abajo). Incluye los datos estructurados JSON-LD. |
| `css/styles.css` | Todos los estilos. Los colores salen de las variables de `:root`; el modo claro las redefine (ver "Modo claro y oscuro"). |
| `js/main.js` | Canales pendientes (WhatsApp y LinkedIn), intro de carga, tema, menú, pestañas del caso real, animaciones de scroll y envío del formulario. |
| `contact.php` | Relay del formulario para el hosting con PHP (Hostinger). |
| `404.html` | Página de error propia. Lleva los estilos en línea, así que no depende del CSS. |
| `assets/og.png` | Imagen que se ve al compartir el link (1200×630). |
| `assets/img/` | Capturas de Club El Progreso, solo en WebP. |
| `assets/isotipo/`, `assets/firma/` | Logo en sus variantes y firma de mail del equipo. La web no los usa. |
| `docs/og-imagen.html` | Fuente de `assets/og.png` (ver "Imagen para compartir"). |
| `docs/plantillas-email.md` | Plantillas para responder las consultas. La web no las usa. |
| `robots.txt`, `sitemap.xml`, `favicon.*` | Lo de siempre. |

## Secciones de la landing

En el orden de `index.html`. Todo el texto va en registro formal (usted o neutro, sin voseo).

1. **Intro de carga** (`#intro`): líneas que se dibujan, el 74 trazándose, "STUDIO 74" letra por letra y un contador que sigue la carga real. Al llegar a 100 aparece **Entrar**; si nadie lo toca, entra sola. La pantalla se abre en dos y el logo vuela a la barra.
2. **Barra de navegación**, con el botón sol/luna del tema y "Solicitar presupuesto".
3. **Portada** (`#inicio`): frase de valor, "Solicitar presupuesto", "Ver un caso real" y la ficha del paquete de entrada.
4. **El problema** (`#problema`): comercios con buena reputación y sin canal digital propio, y los "Problemas que resolvemos" en tercera persona.
5. **Qué hacemos** (`#servicios`): el paquete de entrada (landing + Google Maps + WhatsApp) y, aparte, sistemas a medida, turnos y reservas y automatización. Los enlaces con `data-servicio` dejan marcado ese tipo en el formulario.
6. **Caso real** (`#caso`): Club El Progreso en una ventana con pestañas.
7. **Cómo trabajamos** (`#proceso`): los cuatro pasos.
8. **El estudio** (`#estudio`): los cuatro integrantes. El cargo de cada uno está marcado como pendiente (`.pendiente`, se ve con borde punteado a propósito).
9. **Preguntas frecuentes** (`#preguntas`).
10. **Contacto** (`#contacto`): canales y formulario.
11. **Pie** con redes.

## Cosas a saber antes de tocar

### Intro de carga

- Se muestra **una vez por sesión** (guarda `s74-intro` en `sessionStorage`). Para verla de nuevo: `?intro` en la URL.
- No aparece si el visitante tiene las animaciones reducidas en su dispositivo.
- La activa el script del `<head>` poniendo la clase `con-intro` en `<html>`. **No uses `intro` como nombre de clase en `<html>`**: choca con el componente `.intro` (que arranca con `display: none`) y esconde toda la página.
- Si algo falla, se cierra sola a los 8 segundos.

### Modo claro y oscuro

- Oscuro por defecto. Si el dispositivo está en claro, se ve claro.
- El botón sol/luna fija el tema con `data-theme` en `<html>` y lo guarda en `localStorage` (`s74-tema`).
- Los colores que cambian con el tema son variables (`--fondo`, `--capa`, `--sobre-texto`, `--acento-texto`, `--luz-1`...). Para un color nuevo, agregá la variable en `:root` y en los dos bloques de "Modo claro" de `styles.css`.
- La intro es siempre oscura.

### Redes y canales

Correo, Instagram y GitHub (secundario, solo en el pie) están activos.

**WhatsApp y LinkedIn** están en el HTML pero ocultos. Para activarlos no se toca el HTML:
se completa la constante `CANALES` al principio de `js/main.js`:

```js
const CANALES = {
  whatsapp: '5492254123456', // con código de país, sin "+" ni espacios
  linkedin: 'https://www.linkedin.com/company/...',
};
```

Cada bloque con `data-canal="whatsapp"` o `data-canal="linkedin"` se muestra solo con su enlace.
El de WhatsApp abre la conversación con el mensaje de `MENSAJE_WHATSAPP`. Al activar LinkedIn,
sumá también su URL a `sameAs` en el JSON-LD.

### Animaciones

- Los elementos con `data-reveal` aparecen al hacer scroll. Sin JavaScript se ven igual.
- Todo respeta `prefers-reduced-motion`.

### SEO

- Un solo `h1` (el de la portada).
- JSON-LD con `Organization`/`ProfessionalService` (zona de servicio y catálogo), `Place`, `WebSite` y `FAQPage`. Si cambian las preguntas de `#preguntas`, actualizá también las del JSON-LD.
- Las fuentes (Geist, Geist Mono y Michroma) cargan sin bloquear el primer pintado.

## Probarlo en local

Cualquier servidor de archivos estáticos sirve:

```
py -m http.server 8800 --bind 127.0.0.1
```

Y abrir `http://127.0.0.1:8800/?intro`.

> **No lo levantes con PHP en local.** `contact.php` con un sendmail de prueba contesta
> "enviado" sin mandar nada: un falso éxito, justo lo que el sitio evita. El servidor
> estático reproduce a GitHub Pages: el PHP falla, entra Web3Forms y el mail llega de verdad.

## Cómo sale el formulario

El orden está en `js/main.js`:

1. **`contact.php`** — para cuando el sitio viva en un hosting con PHP.
2. **Web3Forms** — relay para hosting estático, que es lo que usa GitHub Pages hoy.
3. **`mailto:`** — último recurso: abre el cliente de correo del visitante con el mensaje ya escrito.

Si los tres fallan, el visitante ve el error. Nunca un "enviado" que no salió.

La key de Web3Forms es pública a propósito: así funciona el servicio. Sirve para *enviar*
al mail del estudio, no para leer lo que llegó.

## Imagen para compartir

`assets/og.png` sale de `docs/og-imagen.html`. Para regenerarla: levantá el servidor local,
abrí `http://127.0.0.1:8800/docs/og-imagen.html` con la ventana en 1200×630 y sacá una captura.
Después subí el `?v=N` de `og.png` en las etiquetas `og:image` y `twitter:image` de `index.html`,
porque las redes guardan la imagen vieja.

## Publicar

El sitio se publica desde `main`. Para cambios grandes, la forma de trabajo es:

1. Rama nueva, cambios y `git push`.
2. Pull request contra `main` para que el equipo lo revise.
3. Merge: GitHub Pages lo publica en uno o dos minutos (se ve en la pestaña **Actions**).

Dos cosas a tener en cuenta:

- GitHub Pages manda `Cache-Control: max-age=600`, también para el HTML. Después de publicar
  puede hacer falta un `Ctrl+Shift+R` para ver los cambios.
- El CSS y el JS se piden con `?v=N`. **Subí ese número cada vez que los toques**, si no,
  quien ya visitó el sitio va a seguir viendo la versión vieja por diez minutos.

## Pendientes anotados

- Número de WhatsApp del estudio y URL de LinkedIn (constante `CANALES` en `js/main.js`).
- Cargo o área de cada integrante en `#estudio` (marcados `TODO`); apellidos y fotos si se quieren sumar.
- Medios de pago aceptados, en la pregunta frecuente y en el JSON-LD (hoy dice que se detallan en el presupuesto).
- Dominio propio `studio74dev.com` (hoy `studio74dev.github.io` es provisional). Cuando
  esté, hay que actualizar `canonical`, `og:url`, `og:image`, las URLs de `sitemap.xml`,
  `robots.txt`, el JSON-LD de `index.html`, el pie de `docs/og-imagen.html` y el mail de la firma.
- Testimonio real de un cliente (con autorización) y capturas de los proyectos en desarrollo.
