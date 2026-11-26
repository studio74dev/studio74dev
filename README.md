# studio74dev — sitio

Sitio del estudio: **[studio74dev.com.ar](https://studio74dev.com.ar/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura de archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa (ver secciones abajo). Incluye los datos estructurados JSON-LD. |
| `proyectos/index.html` | Lista de proyectos (`/proyectos/`). Cada subpágina copia el `<head>`, la barra y el pie de la home y usa rutas absolutas (`/css/...`). |
| `proyectos/matemar/index.html` | Página del caso Matemar: datos, capturas reales y el pedido ilustrado. |
| `css/styles.css` | Todos los estilos. Paleta de 4 colores y temas por capítulo (ver "Paleta y ritmo"). |
| `js/main.js` | Carga inicial, índice, motor de scroll (revelados, parallax, cortina y palabra del pie), cifras, videos con póster, franja con pausa, barra fija y botón flotante, antes/después de Matemar y formulario "pedido que se arma". |
| `404.html` | Página de error propia. Lleva los estilos en línea, así que no depende del CSS. |
| `assets/fonts/` | Archivo (variable en ancho y peso) y Geist Mono, solo el juego latino, en woff2. |
| `assets/img/stock/` | Fotos y póster de stock (webp, blanco y negro) y `CREDITOS.md` con banco, autor, licencia y verificación de que no son IA. |
| `assets/video/` | `inicio.mp4` y `quienes.mp4` (blanco y negro, sin audio). |
| `assets/img/casos/matemar/` | Capturas reales de matemar.pages.dev (390 y 1440 px), con la fecha en la página del caso. |
| `assets/og.png` | Imagen que se ve al compartir el link (1200×630). |
| `assets/isotipo/`, `assets/firma/` | Logo en sus variantes y firma de mail del equipo. |
| `docs/og-imagen.html` | Fuente de `assets/og.png` (ver "Imagen para compartir"). |
| `robots.txt`, `sitemap.xml`, `favicon.*` | Lo de siempre. |

## Secciones de la landing

En el orden de `index.html`. El texto va en registro **"vos"** (reemplaza al registro anterior), salvo las
preguntas frecuentes, que están en tercera persona porque espejan el JSON-LD.

1. **Carga inicial** (solo la home): ver "Carga inicial".
2. **Barra** (fija arriba): solo el isotipo 74 (con `aria-label` "studio74dev, inicio"), los enlaces, el
   botón **Pedí tu diagnóstico gratis** (pantallas de 760 px o más) y **Índice**, que abre la navegación a
   pantalla completa.
3. **Inicio** (`#inicio`, tinta): título "Tu negocio, encontrado y ordenado.", bajada, botón de diagnóstico y
   **Escribinos por WhatsApp**, con la foto y el video de stock (ver "Foto y video del inicio") y la captura
   de Matemar en un celular.
4. **Franja de servicios** (`#servicios`, tinta): loop lento con botón de pausa (WCAG 2.2.2). Sin movimiento o
   sin JS quedan los cuatro ítems quietos.
5. **¿Te pasa esto?** (`#te-pasa`, papel): tarjetas apiladas (`sticky`), cada problema con su solución en una línea.
6. **Números** (`#numeros`, azul): único bloque azul; el relevamiento con el componente de cifras.
7. **Cómo trabajamos** (`#como-trabajamos`, tinta): pasos y compromisos en desplegables.
8. **Qué revisamos** (`#que-incluye`, tinta): qué incluye el diagnóstico gratis.
9. **Caso** (`#casos`, papel): Matemar (Miramar), antes/después y "Ver el caso".
10. **Quiénes somos** (`#quienes`, tinta): video de ruta (ver "Video de Quiénes somos") y el equipo.
11. **Preguntas frecuentes** (`#preguntas`, papel): en `<details>`.
12. **Diagnóstico** (`#contacto`, papel): formulario "pedido que se arma" (ver "Formulario de contacto") y la
    franja de atención (horario y soporte).
13. **Pie** (`#pie`, tinta): zona, horario, mail, **servicios** (Webs y landing pages · Sistemas a medida ·
    Bots de WhatsApp · Automatización con IA · Soporte y mantenimiento, más "¿Necesitás otra cosa de
    sistemas? Consultanos." con enlace al diagnóstico), redes en íconos, el 74 y la palabra "studio74dev"
    gigante. Es igual en las 3 páginas.

Los ids `#inicio`, `#preguntas` y `#contacto` se conservan (los usa `404.html`).

Hay una **barra fija inferior** solo en el celular (menos de 760 px): aparece al dejar el inicio, con el
botón de diagnóstico y el WhatsApp, y se va al llegar a Contacto, al pie o con el índice abierto. En pantallas
más anchas, en cambio, hay un **botón flotante** de WhatsApp.

## Cosas a saber antes de tocar

### Paleta y ritmo

- Cuatro colores fijos: **tinta** `#0B0B0C`, **papel** `#F4F3EF`, **azul** `#2F5BEA` y **celeste** `#8EA8FF`
  (el celeste es el azul para texto sobre fondos oscuros). Cortes claros, sin degradés.
- Cada capítulo declara `data-tema="tinta|papel|azul"` y eso redefine `--fondo`, `--texto`, `--suave`,
  `--superficie`, `--boton-fondo`, etc. El ritmo de la landing es negro / papel, con un único bloque azul:
  la franja de números. Para un capítulo nuevo alcanza con `class="capitulo"` y su `data-tema`.
- No hay selector de tema del visitante ni color de acento alternativo: salieron con el rediseño. Lo único
  que sigue al esquema del sistema (`prefers-color-scheme`) es la carga inicial.
- Contrastes medidos: blanco sobre azul 5,5:1, azul sobre papel 5:1, celeste sobre tinta 8,6:1. Con
  `prefers-contrast: more` el texto secundario pasa a color pleno.

### Tipografía

- **Archivo** (variable, ejes de ancho 62 %–125 % y peso 100–900) para los títulos condensados enormes y el
  texto corrido; **Geist Mono** para rótulos. Se sirven desde `assets/fonts/`, sin otro dominio.
- Ambas usan `font-display: swap`. Para que el salto de los títulos no genere CLS hay una fuente de respaldo
  (`Archivo Fallback`, con las métricas de Archivo ajustadas sobre Arial). Se precarga solo Archivo.
- Michroma ya no se carga ni se usa (el archivo `michroma-latin.woff2` se movió a `_para_borrar/web-ronda-3`).
- Las palabras muy largas en los títulos llevan guiones suaves (`&shy;`) para cortar bien en el celular.

### Carga inicial

- Solo en la home y solo en la primera visita de la sesión: la palabra "studio74dev" (en minúscula en el DOM;
  las mayúsculas, si las hay, las pone el CSS) se abre, el **74** queda al centro y **vuela** (técnica FLIP)
  hasta el isotipo de la barra. Sigue el esquema del sistema (claro u oscuro, invertido respecto del inicio).
- El script del `<head>` decide con `sessionStorage` (clave `s74-carga`) si agrega `html.con-carga`. La URL
  `?carga` la fuerza y `?carga=0` la evita, para pruebas.
- El fundido y el retiro son CSS puro: si falla el JS, la capa se va sola a los 2,5 s. El JS solo hace el vuelo
  y el cierre anticipado con un click o una tecla. Con reduced-motion o sin JS no hay carga.
- La capa es decorativa (`aria-hidden`).

### Foto y video del inicio

- `#inicio` lleva una foto de stock en blanco y negro (`figure.hero__medio`, es la imagen LCP: sin `lazy`,
  `fetchpriority="high"`) y, encima, un video corto en loop (`assets/video/inicio.mp4`). El video **no** está en
  el HTML como fuente: el JS le pone el `src` recién después del `load`, y solo con `html.mov` (sin
  reduced-motion) y sin conexión ahorrada (`saveData`). Si algo falla, queda la foto.
- Como dura más de 5 s, hay botón de pausa (`.hero__pausa`), y el video se frena solo fuera de pantalla o con la
  pestaña oculta.
- Parallax suave sin `scale()`: la imagen es más alta que su marco y se traslada. Con `animation-timeline: view()`
  lo hace el CSS; sin soporte, el JS escribe `--py`.

### Cómo cambiar la foto o el video del inicio

- **Foto**: mínimo 1600 px de ancho, en webp y de hasta 150 KB (la más grande). Generar 640, 960, 1280 y 1920 px
  y actualizar el `src`, el `srcset`, el `<link rel="preload">` del `<head>` y el `poster` del video. Si es
  propia, agregarla a `assets/img/propias/` y a `CREDITOS.md`.
- **Video**: sin audio, mp4 H.264 (`yuv420p`, `+faststart`), de unos 10 s en loop y de hasta 1,5 MB; cambiar el
  `data-src` del `<video>`. Si dura más de 5 s se mantiene el botón de pausa.
- El comentario `[FOTO: reemplazo futuro opcional del inicio…]` en `index.html` marca el lugar.

### Video de Quiénes somos

`#quienes` usa `assets/video/quienes.mp4` (blanco y negro, sin audio, 21:9) con `assets/img/stock/quienes-ruta-1712.webp`
como póster. No hay autoplay en el HTML: `js/main.js` lo pide al acercarse a la pantalla, solo con movimiento
permitido y sin ahorro de datos, lo pausa fuera de pantalla y ofrece un botón de pausa. Sin personas en el
video, a propósito: una persona de stock ahí parecería uno de los cuatro devs.

### Números con contador (componente "cifra")

En `index.html`, `#numeros`. Cada número es un `<span class="cifra__n cond" data-cifra="175" aria-hidden="true">175</span>`
más un `<span class="visually-hidden">175</span>` con el mismo valor para lectores de pantalla. `js/main.js` lo
cuenta de 0 al valor, una sola vez, cuando entra en pantalla (solo con movimiento permitido). Atributos
opcionales: `data-prefijo` y `data-sufijo` (por ejemplo `data-sufijo="%"`). Sin movimiento o sin JavaScript queda
el valor final escrito en el HTML. Reservá el ancho con `style="min-width:<dígitos>ch"` para que no haya saltos.

### Revelados y movimiento

- Los elementos con `data-revelar` se revelan al entrar (`data-revelar="titulo"` hace subir cada línea del
  título). Con `animation-timeline: view()` lo mueve el scroll desde el CSS; sin soporte (Safari), el JS agrega
  `html.sin-vista` y un `IntersectionObserver` pone la clase `.visto` una sola vez.
- **`html.revelar`**: `js/main.js` la pone al arrancar. Los elementos solo se esconden si ese script corrió. Si el
  JS no carga, todo se ve.
- Todo lo animado vive bajo `html.mov`, que el `<head>` pone solo si hay JavaScript y el dispositivo no pide
  movimiento reducido. **Sin `mov`, la página se ve completa y quieta**: es la versión accesible, no hay que
  mantener otra.
- Microanimaciones tipo iOS: curvas con resorte suave (`--ease-resorte`), presión con escala leve (`--presion`,
  0,97), elevación y sombra al pasar sobre tarjetas e íconos, desenfoque de fondo en la barra (no en el celular,
  donde `backdrop-filter` se recalcula en cada cuadro).
- Se anima solo `transform`, `opacity` y `clip-path`.

### Pie, créditos de íconos y créditos de medios

- El pie tiene el **74** y la palabra **"studio74dev"** a casi todo el ancho (se mide con `cqi`, así no genera
  scroll horizontal). Al llegar al final, la palabra sube deslizándose con el scroll (`animation-timeline`, con
  respaldo de `IntersectionObserver`); con reduced-motion queda quieta.
- **Cortina**: el pie queda fijo debajo del contenido y la página lo va descubriendo. Solo se activa con alto de
  pantalla de 640 px o más y si el pie entra en pantalla (`html.pie-cortina`).
- Redes en **íconos** de 28 px dentro de botones circulares de 48 px, con el nombre en `aria-label`: Instagram,
  Facebook, LinkedIn, mail y WhatsApp. Son de Simple Icons 16.38.1 (LinkedIn: 13.21.0, el último que lo trae),
  licencia CC0; el sobre del mail es propio. Las marcas siguen siendo de sus dueños: se usan solo para enlazar
  a los perfiles propios. Detalle en `assets/img/stock/CREDITOS.md`, sección Íconos.
- La lista de servicios del pie es la misma en las 3 páginas. Los 4 primeros respetan el orden de la ficha de
  Google; "Soporte y mantenimiento" y la invitación abierta se agregaron por decisión de Ramiro (2026-11-26).
  Revisable cuando el estudio escale.

### Medición

No hay scripts de medición de terceros. Cada enlace a WhatsApp, a `#contacto`, a las redes y a `mailto:`, y el
botón de envío del formulario, llevan `data-evento="<tipo>-<lugar>[-<detalle>]"`:

- tipo: `whatsapp`, `diagnostico`, `red` o `mail`;
- lugar: `nav`, `inicio`, `contacto`, `te-pasa`, `que-incluye`, `casos`, `preguntas`, `gracias`, `barra`, `flotante`, `indice` o `pie`.

Ejemplos: `diagnostico-barra`, `diagnostico-pie`, `whatsapp-flotante`, `diagnostico-enviar`,
`red-instagram-pie`. Dentro de una página no se repite ningún valor; `docs/chequeo.py` lo verifica.

Para medir más adelante con Cloudflare Web Analytics hay que decidir antes el script (es una decisión
pendiente, fuera de esta versión). Una vez decidido, un único `click` delegado sobre `[data-evento]` en
`js/main.js` alcanza para enviar el nombre del evento.

### Canales oficiales

Los únicos canales de contacto para el público (URLs exactas):

- Correo: `studio74dev@gmail.com`
- Instagram: https://www.instagram.com/studio74dev/
- LinkedIn: https://www.linkedin.com/company/studio74dev/
- Facebook: https://www.facebook.com/studio74dev/
- Sitio: https://studio74dev.com.ar/

Aparecen en el índice a pantalla completa, en el pie, en `sameAs` del JSON-LD y en las firmas de Gmail
(`assets/firma/`). Si cambia alguno, hay que cambiarlo en todos esos lugares. GitHub no es un canal para el
público: no se enlaza desde la web.

### WhatsApp directo

- Todos los botones son un enlace `https://wa.me/<número con el 9>?text=<mensaje>` escrito **en el HTML**, así
  funciona sin JavaScript. El mensaje es el mismo en todos lados: "Hola studio74dev, quiero el diagnóstico gratis
  para mi negocio".
- El número **no se muestra escrito** en la web ni va en el JSON-LD: solo vive dentro de los `href`. Los
  `aria-label` tampoco lo nombran. Si cambia, hay que cambiarlo en todos los enlaces de las 3 páginas (el enlace
  de "Gracias" arma un resumen de lo elegido).
- Lugares: inicio, Contacto, "Gracias" del formulario, pie, **barra fija** del celular (`#barraCta`, ícono de
  52 px, respeta `env(safe-area-inset-bottom)`) y **botón flotante** de pantallas anchas (`#waFlotante`).
  Ambos usan el azul de marca, no el verde de WhatsApp.
- Pendiente: Ramiro tiene que tocar el botón desde su celular y confirmar que abre el chat correcto.

### Imágenes

- Solo `.webp`, `.avif` o `.svg`, con `alt`, `width`, `height` y `loading="lazy"` (menos en `#inicio`).
- **Fotos de stock** (`assets/img/stock/`): solo de Pexels, Unsplash o Pixabay, sin IA, nunca presentadas como
  clientes ni junto a testimonios. Cada una figura en `CREDITOS.md`. Van en blanco y negro (tratamiento uniforme).
- Para regenerarlas: poner el original en `docs/_stock/originales/` y abrir `docs/fotos.html` (conversor en
  canvas; los parámetros van en la URL) con el servidor local.
- Las capturas de Matemar llevan la fecha en la página del caso.
- Quedan placeholders `[FOTO: …]` para las escenas 4 y 5 de "¿Te pasa esto?" y para el reemplazo opcional del inicio.

### SEO

- Un solo `h1` por página. `sitemap.xml` lista 3 URLs: `/`, `/proyectos/` y `/proyectos/matemar/` (cada una con
  su `title`, `description` y `canonical`).
- JSON-LD con `Organization`/`ProfessionalService` (zona de servicio y catálogo), `Place`, `WebSite` y
  `FAQPage`. Si cambian las preguntas de `#preguntas`, actualizá también las del JSON-LD.
- Las fuentes (Archivo y Geist Mono) cargan sin bloquear el primer pintado.

## Probarlo en local

Cualquier servidor de archivos estáticos sirve:

```
py -m http.server 8800 --bind 127.0.0.1
```

Y abrir `http://127.0.0.1:8800/`. Ese servidor no comprime ni cachea, así que los tiempos de carga son más
pesimistas que en Cloudflare Pages. Para ver la carga inicial de nuevo, abrir `/?carga`.

El servidor estático reproduce lo que publica Cloudflare Pages: el formulario sale por
Web3Forms y el mail llega de verdad. Al probar el formulario en local, el mail llega de verdad al estudio:
usá datos de prueba claros o la simulación de `docs/chequeo-form.js`, que nunca llama a Web3Forms.

## Formulario de contacto

El formulario (`#contactForm`, en `#contacto`) es de **diagnóstico** y funciona como un **pedido que se arma**:
con JavaScript muestra **una pregunta por pantalla** (7 pasos) con opciones grandes y, al costado en escritorio
o arriba y plegable en el celular, la tarjeta **TU DIAGNÓSTICO** que se completa en vivo con lo elegido. El
último paso es la revisión completa y el envío. Los pasos son: qué te cuesta hoy (opción múltiple), rubro,
localidad, cómo atendés hoy, para cuándo, cómo te contactamos (nombre, WhatsApp o correo; con uno alcanza) y
revisión.

Sin JavaScript, todo queda visible en una sola página, en orden, y se envía por `mailto:`. "Seguir" valida
solo el paso actual y "Volver" conserva lo cargado. Al terminar se puede seguir por WhatsApp con un resumen.

El correo que llega tiene asunto `Diagnóstico desde la web — <rubro> (<localidad>)` y una línea por campo. Si
hay correo, se responde a él (`replyto`). Los nombres de los campos no cambian.

El envío está en `js/main.js`:

1. **Web3Forms**: el formulario se manda con `fetch` a `api.web3forms.com`, como `FormData` y sin cabeceras
   propias (así el pedido es "simple" y el navegador no hace el preflight `OPTIONS`). La clave
   (`WEB3FORMS_KEY`) es pública a propósito: sirve para *enviar* al mail del estudio, no para leer lo que
   llegó.
   - Tiempo máximo de 12 s por intento.
   - Tiempo agotado o error 5xx: **un** reintento automático a los 1,5 s.
   - Error 4xx (clave o dominio rechazado): sin reintento.
   - 429 legible: sin reintento; si trae `Retry-After`, "Reintentar" espera ese tiempo.
   - Sin respuesta legible (`Failed to fetch`): sin reintento y con un aviso neutral.
2. **Si falla**: el sitio **nunca** abre el programa de correo por su cuenta. Los campos quedan como estaban y
   aparece el aviso con **Reintentar**, **Copiar correo**, **Abrir en Gmail** y el enlace "Usar el programa
   de correo" (`mailto:`).
3. **Sin JavaScript**: el `action` es `mailto:studio74dev@gmail.com` y un `<noscript>` muestra el correo. Con
   JS, `js/main.js` quita ese `action` al arrancar.

Nunca se muestra un "enviado" que no salió.

**Anti-spam**: dos trampas invisibles que una persona no completa: el campo `company` (honeypot propio) y la
casilla `botcheck` (la de Web3Forms). Si alguna viene completa, el formulario simula el éxito y no envía
nada. Los largos máximos están como `maxlength` en `index.html` y se validan también en `js/main.js`.

## Imagen para compartir

`assets/og.png` sale de `docs/og-imagen.html`. Para regenerarla: levantá el servidor local, abrí
`http://127.0.0.1:8800/docs/og-imagen.html` con la ventana en 1200×630 y sacá una captura. Después subí el `?v=N`
de `og.png` en las etiquetas `og:image` y `twitter:image`, porque las redes guardan la imagen vieja.

## Publicar

Se publica en Cloudflare Pages (proyecto studio74dev) en cada merge a main; DNS en Cloudflare, cuenta
studio74dev@gmail.com. El registro TXT google-site-verification no se borra (verifica Search Console).

Para cambios grandes, la forma de trabajo es:

1. Rama nueva, cambios y `git push`.
2. Pull request contra `main` para que el equipo lo revise.
3. Merge: Cloudflare Pages lo publica solo (el estado del deploy se ve en el panel de Cloudflare).

GitHub Pages está desactivado en este repo. El dominio ya no se configura con un archivo `CNAME`: se maneja
desde Cloudflare.

Dos cosas a tener en cuenta:

- El HTML sale con `Cache-Control: public, max-age=0, must-revalidate`: un cambio en `index.html` se ve apenas
  termina el deploy.
- El CSS, el JS y las imágenes salen con `max-age=14400` (cuatro horas) y se piden con `?v=N` (hoy `?v=42`).
  **Subí ese número cada vez que los toques**, si no, quien ya visitó el sitio va a seguir viendo la versión
  vieja hasta cuatro horas.

## Pendientes para una próxima versión

- **Medios de pago** aceptados, en la pregunta frecuente y en el JSON-LD (hoy dice que se detallan en el presupuesto).
- **Cambios que no son menores**: cómo se cotizan (`[CONFIRMAR]` en la pregunta frecuente).
- **Aviso de privacidad** (Ley 25.326): falta definir quién es el responsable de los datos.
- **Prueba en un iPhone real** (Safari) y del botón de WhatsApp desde el celular.
- **CSP** (Content Security Policy) por `<meta>`.
- **hCaptcha o Turnstile** en el formulario, solo si aparece spam.
- Fotos de las escenas 4 y 5 y, opcional, foto o video propio para el inicio (`[FOTO]`).
- Testimonio real de un cliente (con autorización) y capturas de los proyectos en desarrollo.
