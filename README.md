# Studio 74 — sitio

Sitio del estudio: **[studio74dev.github.io](https://studio74dev.github.io/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura de archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa (ver secciones abajo). Incluye los datos estructurados JSON-LD. |
| `css/styles.css` | Todos los estilos. Paleta del logo y tokens por capítulo (ver "Paleta y capítulos"). |
| `js/main.js` | Canales (WhatsApp y LinkedIn), intro de carga, índice, motor de scroll, teléfono de "Qué hacemos", botones magnéticos, pestañas del caso real y envío del formulario. |
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
Cada capítulo lleva su número (`01`…`09`) y un color de la marca.

1. **Intro de carga** (`#intro`): líneas que se dibujan, el 74 trazándose, "STUDIO 74" letra por letra y un contador que sigue la carga real. Al llegar a 100 aparece **Entrar**; si nadie lo toca, entra sola. La pantalla se abre en dos y el logo vuela a la barra.
2. **Barra**: logo, "Hablemos" e **Índice**, que abre la navegación a pantalla completa. Toma el color del capítulo que tiene debajo, se esconde al bajar y vuelve al subir. A la derecha, el **riel** de progreso: el trazo del 4 con el punto de la marca.
3. **Portada** (`#inicio`, tinta): frase de valor y las dos acciones. Al bajar, los trazos del 7 y el 4 se separan y **el punto crece hasta cubrir la pantalla**: así se entra al capítulo siguiente.
4. **Visión** (`#vision`, señal): el manifiesto se enciende palabra por palabra con el scroll.
5. **El problema** (`#problema`, tinta): los cinco problemas se deslizan en horizontal mientras se baja.
6. **Bandas cruzadas**: dos cintas en diagonal, como los trazos del 7 y el 4, que corren con el scroll.
7. **Qué hacemos** (`#servicios`, papel): un teléfono ilustrativo se arma a medida que se leen los tres pasos del paquete de entrada (página, Google Maps, WhatsApp). Debajo, el trabajo a medida en filas grandes. Los enlaces con `data-servicio` dejan marcado ese tipo en el formulario.
8. **Caso real** (`#caso`, tinta): la ventana de Club El Progreso se apoya y se endereza; sus pestañas funcionan.
9. **Sin letra chica** (`#diferencia`, tinta): los compromisos concretos, con un trazo que se completa.
10. **Proceso** (`#proceso`, tinta): la línea se dibuja con el scroll y enciende cada paso.
11. **El estudio** (`#estudio`, papel): los cuatro integrantes. Los cargos que faltan se ven con borde punteado (`.pendiente`) a propósito.
12. **Preguntas frecuentes** (`#preguntas`, papel).
13. **Contacto** (`#contacto`, tinta): el formulario se completa como una frase ("Hola, mi nombre es…") y al lado van los canales directos.
14. **Pie** con redes y la marca a todo el ancho.

## Cosas a saber antes de tocar

### Intro de carga

- Se muestra **una vez por sesión** (guarda `s74-intro` en `sessionStorage`). Para verla de nuevo: `?intro` en la URL.
- No aparece si el visitante tiene las animaciones reducidas en su dispositivo.
- La activa el script del `<head>` poniendo la clase `con-intro` en `<html>`. **No uses `intro` como nombre de clase en `<html>`**: choca con el componente `.intro` (que arranca con `display: none`) y esconde toda la página.
- Si algo falla, se cierra sola a los 8 segundos.

### Paleta y capítulos

- Solo los tres colores del logo: **tinta** `#0B0B0C`, **papel** `#F4F3EF` y **señal** `#D2FF3A`.
- Cada capítulo declara `data-tema="tinta|papel|senal"` y eso redefine `--fondo`, `--texto`, `--suave`, `--linea`… Para un capítulo nuevo alcanza con ponerle `class="capitulo"` y su `data-tema`.
- La señal nunca va como texto sobre papel (no tiene contraste): sobre papel y señal, el acento es la tinta.
- No hay modo claro: la alternancia de capítulos ya cumple ese papel.

### Animaciones de scroll

- `js/main.js` le da a cada `[data-escena]` una variable `--p` de 0 a 1, y el CSS la usa con `calc()`:
  - `pin`: capítulos altos con una escena fija (`sticky`), como la portada, la visión, el problema y el caso.
  - `entrada`: el elemento entra en pantalla. `paso`: lo atraviesa. `recorrido`: la línea del proceso.
- Todo lo animado vive bajo `html.mov`, que pone el `<head>` solo si hay JavaScript y el dispositivo no pide movimiento reducido. **Sin `mov`, la página se ve completa y quieta**: es la versión accesible, no hay que mantener otra.
- Para cambiar cuánto dura una escena fija, se cambia su `--alto` en `styles.css`. La del problema la calcula el JS según el ancho de las tarjetas.
- Se anima solo `transform`, `opacity` y `clip-path`, para que vaya fluido en celulares.

### Redes y canales

Correo, Instagram, LinkedIn y GitHub (secundario, solo en el pie) están activos.

**WhatsApp** está en el HTML pero oculto. Para activarlo no se toca el HTML:
se completa la constante `CANALES` al principio de `js/main.js`:

```js
const CANALES = {
  whatsapp: '5492254123456', // con código de país, sin "+" ni espacios
  linkedin: 'https://www.linkedin.com/company/...',
};
```

Cada bloque con `data-canal="whatsapp"` se muestra solo con su enlace, que abre la conversación
con el mensaje de `MENSAJE_WHATSAPP`. LinkedIn ya está escrito en el HTML y en `sameAs` del JSON-LD;
si cambia la URL, hay que cambiarla en los tres lugares (índice, contacto y pie) y en el JSON-LD.

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

- Número de WhatsApp del estudio (constante `CANALES` en `js/main.js`).
- Cargo o área de Ramiro, Gerónimo y Valentín en `#estudio` (marcados `TODO`). El de Mariano sale de la firma de mail.
- Medios de pago aceptados, en la pregunta frecuente y en el JSON-LD (hoy dice que se detallan en el presupuesto).
- Dominio propio `studio74dev.com` (hoy `studio74dev.github.io` es provisional). Cuando
  esté, hay que actualizar `canonical`, `og:url`, `og:image`, las URLs de `sitemap.xml`,
  `robots.txt`, el JSON-LD de `index.html`, el pie de `docs/og-imagen.html` y el mail de la firma.
- Testimonio real de un cliente (con autorización) y capturas de los proyectos en desarrollo.
