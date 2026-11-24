# studio74dev — sitio

Sitio del estudio: **[studio74dev.com.ar](https://studio74dev.com.ar/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura de archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa (ver secciones abajo). Incluye los datos estructurados JSON-LD. |
| `proyectos/index.html` | Lista de proyectos (`/proyectos/`). Cada subpágina copia el `<head>`, la barra y el pie de la home y usa rutas absolutas (`/css/...`). |
| `proyectos/matemar/index.html` | Página del caso Matemar: datos, capturas reales y el pedido ilustrado. |
| `css/styles.css` | Todos los estilos. Paleta del logo y tokens por capítulo (ver "Paleta y capítulos"). |
| `js/main.js` | Canales (WhatsApp y LinkedIn), celular animado del inicio (con pausa), tema, índice, motor de scroll, Ruta 74 y barra de progreso, barra fija del celular, tachado de "¿Le pasa esto?", antes/después de Matemar, botones magnéticos y envío del formulario en 3 pasos. |
| `404.html` | Página de error propia. Lleva los estilos en línea, así que no depende del CSS. |
| `assets/img/stock/` | Fotos de stock ilustrativas (webp, duotono) y `CREDITOS.md` con banco, autor, licencia, hash y verificación de que no son IA. |
| `assets/img/casos/matemar/` | Capturas reales de matemar.pages.dev (390 y 1440 px), con la fecha en la página del caso. |
| `assets/og.png` | Imagen que se ve al compartir el link (1200×630). |
| `assets/isotipo/`, `assets/firma/` | Logo en sus variantes y firma de mail del equipo. La web no los usa. |
| `docs/og-imagen.html` | Fuente de `assets/og.png` (ver "Imagen para compartir"). |
| `robots.txt`, `sitemap.xml`, `favicon.*` | Lo de siempre. |

## Secciones de la landing

En el orden de `index.html`. El texto va en registro formal (usted o neutro, sin voseo). Excepción
decidida por el equipo: las acciones "Pedí tu diagnóstico gratis" van en vos/tu, tal como pidió el
pedido original del rediseño.

Cada capítulo lleva su rótulo con número (`01`…`07`) y un `data-tema` que define su fondo: `base`,
`alt` o `contra` (ver "Paleta, temas y capítulos"). Los ids `#inicio`, `#preguntas` y `#contacto`
se conservan (los usa `404.html`); los demás son nuevos.

1. **Celular animado** (dentro de `#inicio`): ya no hay intro de pantalla completa. Un celular hecho en CSS
   muestra en loop de 8 s cómo las consultas sueltas ("¿precio?", "¿abren hoy?", "¿hacen envíos?") se
   ordenan en un pedido completo con ✓. Es decorativo (`aria-hidden`), tiene un botón de pausa
   (WCAG 2.2.2), se pausa solo fuera de pantalla y con la pestaña oculta, y con movimiento reducido
   o sin JS queda quieto en el estado final.
2. **Barra** (fija arriba): el isotipo, los enlaces (Casos, Cómo trabajamos, Quiénes somos, Preguntas),
   el botón de **tema claro/oscuro** y **Pedí tu diagnóstico gratis** (solo en pantallas de 760 px o
   más; en el celular el CTA persistente es la barra inferior). Arriba de todo, la **barra de
   progreso** de lectura; la **Ruta 74** reemplaza al indicador anterior. **Índice** abre la navegación a pantalla
   completa con las 8 entradas de la landing y "Proyectos".
3. **Portada** (`#inicio`, base): título "Que ningún cliente se le escape.", una línea de apoyo, el botón
   **Pedí tu diagnóstico gratis**, el enlace "Ver un caso real" y el celular animado. Todo entra en
   390×844 sin desplazarse.
4. **¿Le pasa esto?** (`#le-pasa`, contra, rótulo `01`): cuatro frases (sin comillas) con una foto
   ilustrativa de stock cada una, rotulada "Foto ilustrativa".
5. **Qué resolvemos** (`#resolvemos`, base, rótulo `02`): mockup de notebook y celular con capturas
   reales de Matemar y cuatro soluciones (dolor y beneficio). El "Cómo" de cada una está en un
   desplegable. Al bajar hasta cada una, su tarjeta y su dolor en "¿Le pasa esto?" se tachan (sin
   movimiento reducido no se tacha nada). Cierra con el botón de diagnóstico.
6. **Casos reales** (`#casos`, contra, rótulo `03`): tarjeta de **Matemar (Miramar)** con deslizador
   antes (ilustración) / después (captura real) y "Ver el caso", más la tarjeta "¿El próximo caso es
   el suyo?" y "Ver todos los proyectos". El detalle vive en `proyectos/matemar/`. El testimonio queda
   oculto hasta tener la autorización.
7. **Cómo trabajamos** (`#como-trabajamos`, base, rótulo `04`): foto ilustrativa, tres pasos con una
   línea cada uno y "Sin letra chica." con cinco compromisos, cada uno en un desplegable (el dominio
   es suyo, presupuesto por escrito, atención en persona, respuesta en 24 horas hábiles y
   seguimiento después de la entrega).
8. **Quiénes somos** (`#quienes`, contra, rótulo `05`): una línea de presentación y el equipo de
   cuatro desarrolladores con su formación. La foto propia (pasarela de Pinamar o Ruta 74) es un
   placeholder `[FOTO]` hasta que se deje en `assets/fuentes/`.
9. **Preguntas frecuentes** (`#preguntas`, base, rótulo `06`): siete preguntas en `<details>`. Las
   respuestas con `[TEXTO]` o `[REVISAR]` son pendientes de contenido.
10. **Formulario de diagnóstico** (`#contacto`, contra, rótulo `07`): una bajada corta, "Qué revisamos"
    en un desplegable y el formulario en tres pasos (ver "Formulario de contacto"), con los canales
    directos al lado.
11. **Pie** (base): zona de servicio, **horario** (lunes a viernes de 9 a 15), los **6 servicios** de la
    ficha de Google (páginas web y landings, fichas de Google Maps, bots y WhatsApp Business, tiendas
    online, sistemas a medida, automatización de pedidos, cobros y reservas), redes y la marca.
    Horario y servicios deben coincidir con la ficha de Google.

El trabajo a medida (sistemas, turnos y reservas, automatización, arreglos de sitios caídos) sigue en
el JSON-LD, pero no se ve en la página (decisión del pedido).

Hay una **barra fija inferior** solo en el celular (menos de 760 px): aparece al bajar de la portada,
con el botón de diagnóstico y el WhatsApp, y se oculta al llegar a Contacto o con el índice abierto.

## Cosas a saber antes de tocar

### Celular animado del inicio

- Vive dentro de `#inicio` (`.hero__visual`, `aria-hidden`). Loop de 8 s con `@keyframes` que animan solo
  `transform` y `opacity`, bajo `html.mov`. No hay overlay ni almacenamiento de sesión: no hay nada que "saltear".
- El botón `.hero__pausa` (48 px) alterna la clase `.tel--pausa`; un `IntersectionObserver` y
  `document.hidden` también lo pausan.
- Sin `mov` (movimiento reducido o sin JS) queda quieto en el estado final y el botón se oculta.

### Paleta, temas y capítulos

- El logo en blanco y negro con un solo color de marca: **tinta** `#0B0B0C`, **papel** `#F4F3EF` y **señal**, un azul costa `#2F5BEA` (más blanco y dos grises oscuros para las tarjetas). Sobre fondos oscuros, el texto de acento usa su versión clara `#8EA8FF`. El azul queda para enlaces, foco, marca y rótulos; no para botones de acción.
- **Acento de acción (A/B)**: los botones de acción usan `--accion`, que puede ser **A** naranja boya `#FF5A1F` (default) o **B** amarillo arena `#FFC738`. Se elige con `?acento=a` o `?acento=b` en la URL (cualquier otro valor cae en A); el script del `<head>` pone `data-acento` en `<html>`. El texto del botón es tinta `#0B0B0C` (6,3:1 con A, 12,5:1 con B; el blanco no llega a 4,5:1). El borde del botón lo da `--boton-borde`: tinta en fondos claros y transparente en oscuros, porque el amarillo casi no se distingue del papel (1,4:1).
- **Tokens del botón**: `--boton-fondo` y `--boton-texto` salen de `--accion` y `--sobre-accion`. Las clases `.btn--accion` (y `.nav__cta`, `#formSeguir`, `.barra-cta__btn`) los usan. `btn--senal` ya no existe.
- El azul de marca vive en `--senal` (con `--senal-claro` y `--sobre-senal`). Para probar otro tono se cambian esas tres y se revisa el contraste. `--acento` es el texto de acento azul (no confundir con `--accion`).
- **Tema claro y oscuro**: `html[data-theme="claro|oscuro"]`. Lo pone el script del `<head>` antes del primer pintado: el que eligió el visitante con el botón de la barra (guardado en `localStorage` como `s74-tema`) o, si nunca lo tocó, el del sistema.
- Cada capítulo declara `data-tema="base|alt|contra|senal"` y eso redefine `--fondo`, `--texto`, `--suave`, `--superficie`, `--boton-fondo`… según el tema. `base` y `alt` cambian con el tema. `contra` invierte el tema del capítulo (papel en oscuro, tinta en claro) y alterna con los anteriores: es lo que da el ritmo claro/oscuro de la landing. `senal` es azul en los dos. Para un capítulo nuevo alcanza con ponerle `class="capitulo"` y su `data-tema`.
- Contrastes: blanco sobre el azul 5,5:1, azul sobre papel 5:1, azul claro sobre tinta 8,6:1. Con `prefers-contrast: more` el texto secundario pasa a color pleno.

### Tipografía

- Las fuentes se sirven desde `assets/fonts/` (solo el juego latino, en woff2; se declaran al principio de `styles.css`). La de los títulos se precarga en el `<head>` y usa `font-display: optional`: si no llegó para el primer pintado, esa visita sigue con la del sistema en lugar de mover la portada. No se usa Google Fonts: un dominio menos y sin bloquear el primer pintado.
- **Archivo** (variable con ejes de ancho y peso). Los títulos grandes usan `font-stretch: 125%`, peso 900 y mayúsculas: una grotesca extendida y negra. El texto corrido va en Archivo normal.
- **Geist Mono** para rótulos chicos y **Michroma** solo para la marca ("STUDIO 74").
- Las palabras muy largas en los títulos llevan guiones suaves (`&shy;`) para cortar bien en el celular.

### Animaciones de scroll y Ruta 74

- La landing ya no tiene escenas fijas ni giros 3D. Lo que se mueve:
  - `entrada` (`data-escena="entrada"`): tarjetas, dolores, soluciones, casos, compromisos y miembros del equipo. Un `IntersectionObserver` le pone la clase `.visto` **una sola vez** cuando aparece y el CSS hace la transición (opacidad y `translateY`, hasta 400 ms).
  - `recorrido`: la línea de los pasos de "Cómo trabajamos".
  - **Ruta 74**: un SVG (`#ruta`) en el margen izquierdo, que nace debajo del 74 de la barra y pasa por un
    hito (`.hito`) por capítulo. `trazarRuta()` en `js/main.js` arma el camino; se dibuja con
    `animation-timeline: scroll()`. Sin ese soporte, la clase `sin-sda` en `<html>` activa un respaldo
    que escribe `--progreso` desde el scroll. Los hitos se encienden una sola vez (`.encendido`).
  - **Barra de progreso** (`.progreso`): 3 px arriba, mismo mecanismo (scroll-driven o `sin-sda`). Queda
    con movimiento reducido porque informa y no se mueve sola.
  - **Parallax** de la luz de fondo (`.capitulo::before`): hasta 20 px con `animation-timeline: view()`,
    sin respaldo JS. Lleva `will-change: transform`: sin eso Lighthouse móvil bajaba a ~75 por repintar los
    degradados de las 8 secciones.
  - El tachado de "¿Le pasa esto?" (`.resuelto`), la barra fija y el deslizador de Matemar.
- **`html.revelar`**: `js/main.js` pone esta clase al arrancar. Las entradas solo esconden texto si ese script corrió (las reglas van bajo `.mov.revelar`). Si el JS no carga, todo se ve.
- Todo lo animado vive bajo `html.mov`, que pone el `<head>` solo si hay JavaScript y el dispositivo no pide movimiento reducido. **Sin `mov`, la página se ve completa y quieta**: es la versión accesible, no hay que mantener otra. Con `prefers-reduced-motion`, el celular, la Ruta 74 completa, el tachado y las transiciones de la barra quedan quietos.
- Se anima solo `transform`, `opacity` y `clip-path` (la excepción es `stroke-dashoffset` de la Ruta 74), para que vaya fluido en celulares. En el celular la barra va sin desenfoque (`backdrop-filter` se recalcula en cada cuadro).

### Canales oficiales

Los únicos canales de contacto para el público (URLs exactas):

- Correo: `studio74dev@gmail.com`
- Instagram: https://www.instagram.com/studio74dev/
- LinkedIn: https://www.linkedin.com/company/studio74dev/
- Facebook: https://www.facebook.com/studio74dev/
- Sitio: https://studio74dev.com.ar/

Aparecen en el índice a pantalla completa, en Contacto, en el pie, en `sameAs` del JSON-LD y en las
firmas de Gmail (`assets/firma/`). Si cambia alguno, hay que cambiarlo en todos esos lugares.
GitHub no es un canal para el público: no se enlaza desde la web.

**WhatsApp**: el número **no se muestra en la web** ni va en el JSON-LD. Solo se usa dentro del
enlace a `wa.me`, y se carga en un solo lugar, la constante `CANALES` al principio de `js/main.js`,
armado por partes para que no quede escrito de corrido:

```js
const CANALES = {
  whatsapp: ['<código de país>', '<característica>', '<número en partes>'].join(''), // sin "+" ni espacios
  linkedin: 'https://www.linkedin.com/company/studio74dev/',
};
```

Los textos visibles dicen solo "WhatsApp" (portada) o "Abrir chat" (Contacto), y los `aria-label`
tampoco nombran el número.

Cada bloque con `data-canal="whatsapp"` recibe el enlace a `wa.me` con el mensaje de
`MENSAJE_WHATSAPP` ("Hola studio74dev, vengo de la web y quiero consultar por", abierto para que
el visitante lo termine) y recién ahí se muestra. **Sin JavaScript quedan ocultos**: nunca hay un
enlace roto. Están en Contacto (primer canal), en el pie y en los dos lugares flotantes, que
dependen del ancho:

- **Celular (menos de 760 px)**: la **barra fija inferior** (`#barraCta`) tiene el botón de
  diagnóstico y, a la derecha, un ícono de WhatsApp de 52 px. El flotante no se muestra.
  Respeta `env(safe-area-inset-bottom)` y reserva espacio al pie para no tapar contenido.
- **Pantallas de 760 px o más**: el **botón flotante** (`#waFlotante`), abajo a la derecha, con el
  texto "WhatsApp". La barra fija no existe.
- En ambos casos usa el azul de marca (`--senal`), no el verde de WhatsApp: el sitio tiene un solo
  color de marca. Toma el `data-tema` del capítulo que tiene debajo.
- La barra fija aparece al bajar de la portada y se va al llegar a Contacto o con el índice abierto.
  El flotante aparece al dejar la portada y se va al llegar a Contacto o con el índice abierto. Lo
  decide el motor de scroll de `js/main.js`.
- Oculto usa `visibility: hidden` o `hidden`, así no recibe foco con el teclado.

### Animaciones

- Las entradas de scroll (`data-escena="entrada"`) aparecen al bajar. Sin JavaScript se ven igual.
- Todo respeta `prefers-reduced-motion`.

### Imágenes

- Solo `.webp`, `.avif` o `.svg`, con `alt`, `width`, `height` y `loading="lazy"` (menos en `#inicio`).
- **Fotos de stock** (`assets/img/stock/`): solo de Pexels, Unsplash o Pixabay, sin IA, nunca presentadas como
  clientes ni junto a testimonios, siempre con el rótulo "Foto ilustrativa". Cada una figura en `CREDITOS.md`.
  Van recortadas a 4:3, en duotono de marca (`#0B0B0C` a `#8EA8FF`) y de hasta 150 KB (480 y 960 px).
- Para regenerarlas: poner el original en `docs/_stock/originales/` y abrir `docs/fotos.html` (conversor en
  canvas; los parámetros van en la URL) con el servidor local.
- Las capturas de Matemar llevan la fecha en la página del caso.

### SEO

- Un solo `h1` por página. `sitemap.xml` lista 3 URLs: `/`, `/proyectos/` y `/proyectos/matemar/` (cada una con su `title`, `description` y `canonical`).
- JSON-LD con `Organization`/`ProfessionalService` (zona de servicio y catálogo), `Place`, `WebSite` y `FAQPage`. Si cambian las preguntas de `#preguntas`, actualizá también las del JSON-LD.
- Las fuentes (Archivo, Geist Mono y Michroma) cargan sin bloquear el primer pintado.

## Probarlo en local

Cualquier servidor de archivos estáticos sirve:

```
py -m http.server 8800 --bind 127.0.0.1
```

Y abrir `http://127.0.0.1:8800/`.

El servidor estático reproduce lo que publica Cloudflare Pages: el formulario sale por
Web3Forms y el mail llega de verdad.

## Formulario de contacto

El formulario (`#contactForm`, en `#contacto`) es de **diagnóstico en 3 pasos**. Con JavaScript, la
página muestra un paso por vez, con "Paso n de 3" (anunciado con `aria-live`), la barra de avance,
**Volver** y **Seguir**. Sin JavaScript, los tres bloques quedan en una sola página, en orden, con el
botón **Pedir mi diagnóstico** al final.

1. **¿Qué le está costando hoy?** Chips de opción múltiple (al menos uno): Consultas repetidas,
   Pedidos desordenados, No aparezco en Google, No doy abasto en temporada, Otra.
2. **Su negocio**: Rubro (texto, obligatorio), Localidad (lista de las 14 zonas de la landing más
   "Otra", obligatoria) y, opcional, "¿Cómo atiende hoy?" (Solo en el local, Instagram, WhatsApp,
   Ya tengo web).
3. **¿Cómo lo contactamos?**: "Para cuándo" (obligatorio: Antes de la temporada, Este mes, Sin apuro),
   Nombre (obligatorio), WhatsApp y Correo. Con uno de los dos alcanza; si faltan los dos, el
   formulario avisa y no envía.

"Seguir" valida solo el paso actual. "Volver" conserva lo cargado. En los pasos 1 y 2, Enter en un campo de texto
equivale a "Seguir" y no envía. Tras un envío exitoso, el formulario vuelve al paso 1 y el botón
muestra "Pedido enviado" con la nota "Recibimos su pedido. Le respondemos dentro de las 24 horas hábiles."
Si el envío falla, se queda en el paso 3 con el aviso de reintento.

El correo que llega tiene asunto `Diagnóstico desde la web — <rubro> (<localidad>)` y una línea por
campo: Nombre, WhatsApp, Correo, Qué le está costando, Rubro, Localidad, Cómo atiende hoy y Para
cuándo. Si hay correo, se responde a él (`replyto`).

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
y no envía nada. Los largos máximos (nombre 80, correo 120, rubro 80, WhatsApp 30) están como
`maxlength` en `index.html` y se validan también en `js/main.js` antes de enviar.

## Imagen para compartir

`assets/og.png` sale de `docs/og-imagen.html`. Para regenerarla: levantá el servidor local,
abrí `http://127.0.0.1:8800/docs/og-imagen.html` con la ventana en 1200×630 y sacá una captura.
Después subí el `?v=N` de `og.png` en las etiquetas `og:image` y `twitter:image` de `index.html`,
porque las redes guardan la imagen vieja.

## Publicar

Se publica en Cloudflare Pages (proyecto studio74dev) en cada merge a main; DNS en
Cloudflare, cuenta studio74dev@gmail.com. El registro TXT google-site-verification no se
borra (verifica Search Console).

Para cambios grandes, la forma de trabajo es:

1. Rama nueva, cambios y `git push`.
2. Pull request contra `main` para que el equipo lo revise.
3. Merge: Cloudflare Pages lo publica solo (el estado del deploy se ve en el panel de
   Cloudflare, proyecto studio74dev).

GitHub Pages está desactivado en este repo. El dominio ya no se configura con un archivo
`CNAME`: se maneja desde Cloudflare.

Dos cosas a tener en cuenta:

- El HTML sale con `Cache-Control: public, max-age=0, must-revalidate`: un cambio en
  `index.html` se ve apenas termina el deploy.
- El CSS, el JS y las imágenes salen con `max-age=14400` (cuatro horas) y se piden con
  `?v=N`. **Subí ese número cada vez que los toques**, si no, quien ya visitó el sitio
  va a seguir viendo la versión vieja hasta cuatro horas.

## Pendientes para una próxima versión

- **Medios de pago** aceptados, en la pregunta frecuente y en el JSON-LD (hoy dice que se detallan en el presupuesto).
- **Aviso de privacidad** (Ley 25.326): falta definir quién es el responsable de los datos.
- **Prueba en un iPhone real** (Safari).
- **CSP** (Content Security Policy) por `<meta>`.
- **hCaptcha o Turnstile** en el formulario, solo si aparece spam.
- Testimonio real de un cliente (con autorización) y capturas de los proyectos en desarrollo.
