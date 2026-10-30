# Studio 74 — sitio

Sitio del estudio: **[studio74dev.com.ar](https://studio74dev.com.ar/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura de archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa (ver secciones abajo). Incluye los datos estructurados JSON-LD. |
| `css/styles.css` | Todos los estilos. Paleta del logo y tokens por capítulo (ver "Paleta y capítulos"). |
| `js/main.js` | Canales (WhatsApp y LinkedIn), intro de carga, índice, motor de scroll, teléfono de "Qué hacemos", botones magnéticos, pestañas del caso real y envío del formulario. |
| `404.html` | Página de error propia. Lleva los estilos en línea, así que no depende del CSS. |
| `assets/og.png` | Imagen que se ve al compartir el link (1200×630). |
| `assets/img/` | Capturas de Club El Progreso, solo en WebP. |
| `assets/isotipo/`, `assets/firma/` | Logo en sus variantes y firma de mail del equipo. La web no los usa. |
| `docs/og-imagen.html` | Fuente de `assets/og.png` (ver "Imagen para compartir"). |
| `robots.txt`, `sitemap.xml`, `favicon.*` | Lo de siempre. |

## Secciones de la landing

En el orden de `index.html`. Todo el texto va en registro formal (usted o neutro, sin voseo).
Cada capítulo lleva su número (`01`…`09`) y un tipo de fondo (`base`, `alt` o `senal`).

1. **Intro de carga** (`#intro`): líneas que se dibujan, el 74 trazándose, "STUDIO 74" letra por letra y un contador que sigue la carga real. Al llegar a 100 aparece **Entrar**; si nadie lo toca, entra sola. La pantalla se abre en dos y el logo vuela a la barra.
2. **Barra**: fina, esmerilada y siempre visible. El isotipo (sin "STUDIO 74" al lado, para no repetir el 74), las secciones (en pantallas anchas, marcando la que se está leyendo), el botón de **tema claro/oscuro**, "Hablemos" (también en el celular) e **Índice**, que abre la navegación a pantalla completa. Toma el color del capítulo que tiene debajo. A la derecha, el **riel** de progreso: el trazo del 4 con el punto de la marca.
3. **Portada** (`#inicio`, base): frase de valor centrada, con el 74 detrás, y las dos acciones. Al bajar, el texto se va, el 74 se enciende, los trazos del 7 y el 4 se separan y **el punto crece hasta cubrir la pantalla**: así se entra al capítulo siguiente.
4. **Visión** (`#vision`, señal, azul): el manifiesto se enciende palabra por palabra con el scroll.
5. **El problema** (`#problema`, base): los cinco problemas se deslizan en horizontal mientras se baja.
6. **Bandas cruzadas**: dos cintas en diagonal, como los trazos del 7 y el 4, que corren con el scroll.
7. **Qué hacemos** (`#servicios`, alt): un teléfono ilustrativo se arma a medida que se leen los tres pasos del paquete de entrada (página, Google Maps, WhatsApp). Debajo, el trabajo a medida en un mosaico de tarjetas. Los enlaces con `data-servicio` dejan marcado ese tipo en el formulario.
8. **Caso real** (`#caso`, base): en pantallas anchas la ventana de Club El Progreso se apoya y se endereza; en el celular va suelta y la imagen se recorre con el dedo. Sus pestañas funcionan y **Ampliar** (o tocar la imagen) la abre a tamaño real en un visor (`<dialog>`).
9. **Sin letra chica** (`#diferencia`, base): los compromisos concretos en un mosaico, con un trazo que se completa.
10. **Proceso** (`#proceso`, alt): la línea se dibuja con el scroll y enciende cada paso.
11. **El estudio** (`#estudio`, base): los cuatro desarrolladores full stack con su formación (Licenciatura en Sistemas y Técnico en Software).
12. **Preguntas frecuentes** (`#preguntas`, alt).
13. **Contacto** (`#contacto`, base): formulario simple con etiquetas visibles (nombre, correo, tipo de consulta y mensaje) y, al lado, los canales directos.
14. **Pie** con redes y la marca a todo el ancho.

## Cosas a saber antes de tocar

### Intro de carga

- Se muestra **una vez por sesión** (guarda `s74-intro` en `sessionStorage`) y **solo en pantallas de 760 px o más**: en el celular se entra directo a la portada. Para verla de nuevo (también en el celular): `?intro` en la URL.
- No aparece si el visitante tiene las animaciones reducidas en su dispositivo.
- La activa el script del `<head>` poniendo la clase `con-intro` en `<html>`. **No uses `intro` como nombre de clase en `<html>`**: choca con el componente `.intro` (que arranca con `display: none`) y esconde toda la página.
- Si algo falla, se cierra sola a los 8 segundos.

### Paleta, temas y capítulos

- El logo en blanco y negro con un solo color de acento: **tinta** `#0B0B0C`, **papel** `#F4F3EF` y **señal**, un azul costa `#2F5BEA` (más blanco y dos grises oscuros para las tarjetas). Sobre fondos oscuros, el texto de acento usa su versión clara `#8EA8FF`.
- El acento vive en una sola variable (`--senal` en `styles.css`), con `--senal-claro` y `--sobre-senal` (texto encima). Para probar otro tono se cambian esas tres y se revisa el contraste.
- **Tema claro y oscuro**: `html[data-theme="claro|oscuro"]`. Lo pone el script del `<head>` antes del primer pintado: el que eligió el visitante con el botón de la barra (guardado en `localStorage` como `s74-tema`) o, si nunca lo tocó, el del sistema.
- Cada capítulo declara `data-tema="base|alt|senal"` y eso redefine `--fondo`, `--texto`, `--suave`, `--superficie`, `--boton-fondo`… según el tema. `base` y `alt` cambian con el tema; `senal` es verde en los dos. Para un capítulo nuevo alcanza con ponerle `class="capitulo"` y su `data-tema`.
- Contrastes: blanco sobre el azul 5,5:1, azul sobre papel 5:1, azul claro sobre tinta 8,6:1. Con `prefers-contrast: more` el texto secundario pasa a color pleno.

### Tipografía

- Las fuentes se sirven desde `assets/fonts/` (solo el juego latino, en woff2; se declaran al principio de `styles.css`). La de los títulos se precarga en el `<head>` y usa `font-display: optional`: si no llegó para el primer pintado, esa visita sigue con la del sistema en lugar de mover la portada. No se usa Google Fonts: un dominio menos y sin bloquear el primer pintado.
- **Archivo** (variable con ejes de ancho y peso). Los títulos grandes usan `font-stretch: 125%`, peso 900 y mayúsculas: una grotesca extendida y negra. El texto corrido va en Archivo normal.
- **Geist Mono** para rótulos chicos y **Michroma** solo para la marca ("STUDIO 74").
- Las palabras muy largas en los títulos llevan guiones suaves (`&shy;`) para cortar bien en el celular.

### Animaciones de scroll

- `js/main.js` le da a cada `[data-escena]` una variable `--p` de 0 a 1, y el CSS la usa con `calc()`:
  - `pin`: capítulos altos con una escena fija (`sticky`), como la portada, la visión, el problema y el caso.
  - `paso`: el elemento atraviesa la pantalla (las bandas). `recorrido`: la línea del proceso.
- `entrada` no usa `--p`: un `IntersectionObserver` le pone la clase `.visto` **una sola vez** cuando aparece y el CSS hace la transición. Así las tarjetas entran fluidas aunque el dedo vaya rápido o lento.
- El motor lee todas las posiciones primero y escribe después (sin forzar el diseño varias veces por cuadro), y solo toca el estilo de lo que cambió.
- Todo lo animado vive bajo `html.mov`, que pone el `<head>` solo si hay JavaScript y el dispositivo no pide movimiento reducido. **Sin `mov`, la página se ve completa y quieta**: es la versión accesible, no hay que mantener otra.
- Para cambiar cuánto dura una escena fija, se cambia su `--alto` en `styles.css`. La del problema la calcula el JS según el ancho de las tarjetas.
- Se anima solo `transform`, `opacity` y `clip-path`, para que vaya fluido en celulares. En el celular la barra va sin desenfoque (`backdrop-filter` se recalcula en cada cuadro).

### Canales oficiales

Los únicos canales de contacto para el público (URLs exactas):

- Correo: `studio74dev@gmail.com`
- Instagram: https://www.instagram.com/studio74dev/
- LinkedIn: https://www.linkedin.com/company/studio74dev/
- Facebook: https://www.facebook.com/people/Studio74Dev/61595921825522/
- Sitio: https://studio74dev.com.ar/

Aparecen en el índice a pantalla completa, en Contacto, en el pie, en `sameAs` del JSON-LD y en las
firmas de Gmail (`assets/firma/`). Si cambia alguno, hay que cambiarlo en todos esos lugares.
GitHub no es un canal para el público: no se enlaza desde la web.

**WhatsApp** está en el HTML pero oculto. Para activarlo no se toca el HTML:
se completa la constante `CANALES` al principio de `js/main.js`:

```js
const CANALES = {
  whatsapp: '5492254123456', // con código de país, sin "+" ni espacios
  linkedin: 'https://www.linkedin.com/company/studio74dev/',
};
```

Cada bloque con `data-canal="whatsapp"` se muestra solo con su enlace, que abre la conversación
con el mensaje de `MENSAJE_WHATSAPP`. Hoy no hay número: es para una próxima versión.

### Animaciones

- Los elementos con `data-reveal` aparecen al hacer scroll. Sin JavaScript se ven igual.
- Todo respeta `prefers-reduced-motion`.

### SEO

- Un solo `h1` (el de la portada).
- JSON-LD con `Organization`/`ProfessionalService` (zona de servicio y catálogo), `Place`, `WebSite` y `FAQPage`. Si cambian las preguntas de `#preguntas`, actualizá también las del JSON-LD.
- Las fuentes (Archivo, Geist Mono y Michroma) cargan sin bloquear el primer pintado.

## Probarlo en local

Cualquier servidor de archivos estáticos sirve:

```
py -m http.server 8800 --bind 127.0.0.1
```

Y abrir `http://127.0.0.1:8800/?intro`.

El servidor estático reproduce a GitHub Pages: el formulario sale por Web3Forms y el mail
llega de verdad.

## Formulario de contacto

El envío está en `js/main.js`:

1. **Web3Forms** — el formulario se manda con `fetch` a `api.web3forms.com`, como `FormData`
   y sin cabeceras propias: así el pedido es "simple" y el navegador no hace el preflight
   `OPTIONS`. La clave (`WEB3FORMS_KEY` en `js/main.js`) es pública a propósito: así funciona
   el servicio. Sirve para *enviar* al mail del estudio, no para leer lo que llegó.
   - Tiempo máximo de 12 s por intento.
   - Tiempo agotado o error 5xx: **un** reintento automático a los 1,5 s.
   - Error 4xx (clave o dominio rechazado): sin reintento.
   - 429 legible: sin reintento, porque empeora el límite; si trae `Retry-After`,
     "Reintentar" espera ese tiempo.
   - Sin respuesta legible (`Failed to fetch`): sin reintento y con un aviso neutral. Puede
     ser una red caída o el 429 de Web3Forms, que limita por IP y responde sin cabeceras
     CORS: el navegador no deja distinguirlos.
2. **Si falla**: el sitio **nunca** abre el programa de correo por su cuenta. Los campos
   quedan como estaban y aparece el aviso con **Reintentar**, **Copiar correo**, **Abrir en
   Gmail** (pestaña nueva, con el mensaje cargado) y el enlace "Usar el programa de correo"
   (`mailto:`), además del correo del estudio como texto.
3. **Sin JavaScript**: el `action` del formulario es `mailto:studio74dev@gmail.com` y un
   `<noscript>` muestra el correo. Con JS, `js/main.js` quita ese `action` al arrancar.

Nunca se muestra un "enviado" que no salió.

**Anti-spam**: dos trampas invisibles que una persona no completa. El campo `company`
(honeypot propio) y la casilla `botcheck` (la de Web3Forms, que además se manda en el
envío y el servicio la revisa). Si alguna viene completa, el formulario simula el éxito
y no envía nada. Los largos máximos (nombre 80, correo 120, mensaje 2000) están como
`maxlength` en `index.html` y se validan también en `js/main.js` antes de enviar.

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

## Pendientes para una próxima versión

- **WhatsApp del estudio**: cargar el número en la constante `CANALES` de `js/main.js`.
- **Medios de pago** aceptados, en la pregunta frecuente y en el JSON-LD (hoy dice que se detallan en el presupuesto).
- **Aviso de privacidad** (Ley 25.326): falta definir quién es el responsable de los datos.
- **Prueba en un iPhone real** (Safari).
- **CSP** (Content Security Policy) por `<meta>`.
- **hCaptcha o Turnstile** en el formulario, solo si aparece spam.
- Testimonio real de un cliente (con autorización) y capturas de los proyectos en desarrollo.
