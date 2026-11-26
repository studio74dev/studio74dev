/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT V12
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Carga inicial ───────────────────────────────── */
  /* Solo si el <head> puso html.con-carga. El CSS hace la subida, el cierre de los costados
     y el fundido (si este script falla, la carga se va sola a los 2,5 s). Acá solo se hace el
     vuelo del 74 al logo (FLIP, calculado en el momento del vuelo) y el cierre anticipado con
     un click, un toque o una tecla. */
  (function () {
    const raiz = document.documentElement;
    const carga = document.getElementById('carga');
    if (!carga || !raiz.classList.contains('con-carga')) return;

    let temporizadores = [];
    const terminar = () => {
      temporizadores.forEach(clearTimeout);
      temporizadores = [];
      ['click', 'keydown', 'touchstart'].forEach((ev) => window.removeEventListener(ev, terminar, true));
      if (!raiz.classList.contains('con-carga')) return;
      carga.getAnimations({ subtree: true }).forEach((an) => an.cancel());
      raiz.classList.remove('con-carga');
    };
    ['click', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, terminar, { capture: true, passive: true }));
    carga.addEventListener('animationend', (e) => { if (e.animationName === 'carga-fuera') terminar(); });

    const volar = () => {
      const el = carga.querySelector('.carga__74');
      const logo = document.querySelector('.nav__logo-icon');
      if (!el || !logo || !el.animate) return;
      const primero = el.getBoundingClientRect();
      const ultimo = logo.getBoundingClientRect();
      // Si la barra no está a la vista, no se vuela: el CSS cierra la carga
      if (!primero.height || !ultimo.width || ultimo.bottom <= 0) return;
      const escala = ultimo.height / primero.height;
      const dx = (ultimo.left + ultimo.width / 2) - (primero.left + primero.width / 2);
      const dy = (ultimo.top + ultimo.height / 2) - (primero.top + primero.height / 2);
      el.style.transformOrigin = 'center';
      el.animate(
        [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${escala})` }],
        { duration: 650, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }
      );
    };

    // El reloj de la secuencia es el de las animaciones CSS (arrancan en el primer pintado,
    // no en el inicio de la navegación): el vuelo empieza a 1,4 s de ese momento.
    const ref = carga.getAnimations().find((an) => an.animationName === 'carga-fuera');
    const programar = (t0) => {
      const espera = t0 + 1400 - performance.now();
      if (espera < -200) return; // llegó tarde: el CSS cierra la carga solo
      temporizadores.push(setTimeout(volar, Math.max(0, espera)));
      temporizadores.push(setTimeout(terminar, Math.max(0, t0 + 2550 - performance.now())));
    };
    if (ref && ref.ready) ref.ready.then(() => programar(ref.startTime == null ? performance.now() : ref.startTime));
    else programar(performance.now());
  })();

  // Las entradas de scroll solo esconden texto si este script corrió (html.mov.revelar)
  document.documentElement.classList.add('revelar');

  /* ── Formulario: sin envío nativo ────────────────── */
  /* Lo primero de todo: con JS, el action mailto (respaldo sin JS) se quita y
     el envío nativo queda frenado, aunque algo de abajo falle. El envío real
     lo hace el bloque "Contact form", al final. */
  const formNativo = document.getElementById('contactForm');
  if (formNativo) {
    formNativo.removeAttribute('action');
    formNativo.removeAttribute('enctype');
    formNativo.addEventListener('submit', (e) => e.preventDefault());
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Animaciones de scroll: solo si el <head> puso html.mov
  const mov = document.documentElement.classList.contains('mov');

  const root = document.documentElement;

  /* ── Índice a pantalla completa ──────────────────── */
  const header = document.getElementById('header');
  const menuBoton = document.getElementById('menuBoton');
  const indice = document.getElementById('indice');
  let temaAntes = 'tinta';

  const cerrarIndice = (volverAlBoton) => {
    if (menuBoton.getAttribute('aria-expanded') !== 'true') return;
    menuBoton.setAttribute('aria-expanded', 'false');
    indice.classList.remove('abierto');
    header.dataset.tema = temaAntes;
    document.body.style.overflow = '';
    setTimeout(() => { indice.hidden = true; }, mov ? 600 : 0);
    pedir(); // el WhatsApp flotante vuelve si corresponde
    if (volverAlBoton) menuBoton.focus();
  };

  const abrirIndice = () => {
    indice.hidden = false;
    temaAntes = header.dataset.tema;
    header.dataset.tema = 'tinta';
    menuBoton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    pedir(); // el WhatsApp flotante se oculta mientras el índice está abierto
    requestAnimationFrame(() => requestAnimationFrame(() => indice.classList.add('abierto')));
    indice.querySelector('a').focus({ preventScroll: true });
  };

  menuBoton.addEventListener('click', () => {
    menuBoton.getAttribute('aria-expanded') === 'true' ? cerrarIndice(false) : abrirIndice();
  });
  indice.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => cerrarIndice(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarIndice(true);
  });

  /* ── Motor de scroll ─────────────────────────────── */
  /* Cada [data-escena] recibe --p entre 0 y 1 según el tipo:
     - pin: el capítulo es más alto que la pantalla; 0 cuando su borde de
       arriba toca el de la pantalla, 1 cuando su borde de abajo toca el de abajo.
     - entrada: no sigue al scroll; recibe la clase .visto una sola vez al aparecer
       y el CSS hace la transición (fluida aunque el dedo vaya rápido o lento).
     - paso: 0 cuando asoma por abajo, 1 cuando se fue por arriba.
     - recorrido: la línea del proceso, que avanza con el centro de la pantalla.
     También pinta el color de la barra, marca en la barra la sección que se
     está leyendo y el avance de los revelados. */
  const escenas = Array.from(document.querySelectorAll('[data-escena]'));
  const capitulos = Array.from(document.querySelectorAll('.capitulo[data-tema]'));
  const linksBarra = Array.from(document.querySelectorAll('.nav__links a'));
  const waFlotante = document.getElementById('waFlotante');
  const barraCta = document.getElementById('barraCta');
  if (barraCta) barraCta.hidden = false;
  const iPortada = capitulos.findIndex((c) => c.hasAttribute('data-portada'));
  const iContacto = capitulos.findIndex((c) => c.id === 'contacto');
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const continuas = escenas.filter((el) => el.dataset.escena !== 'entrada');
  let entradas = escenas.filter((el) => el.dataset.escena === 'entrada');
  let altoBarra = header.offsetHeight;

  const mostrar = (el) => el.classList.add('visto');
  let revelar = null;
  if ('IntersectionObserver' in window) {
    revelar = new IntersectionObserver((lista) => {
      lista.forEach((e) => {
        if (!e.isIntersecting) return;
        mostrar(e.target);
        revelar.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    // Regla general: lo que ya está en la primera pantalla no arranca oculto
    // (se muestra en el mismo cuadro en que corre el script, sin transición).
    const primera = entradas.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
    primera.forEach((el) => {
      el.classList.add('sin-transicion');
      mostrar(el);
    });
    if (primera.length) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        primera.forEach((el) => el.classList.remove('sin-transicion'));
      }));
    }
    entradas.filter((el) => !primera.includes(el)).forEach((el) => revelar.observe(el));
  } else {
    entradas.forEach(mostrar);
    entradas = [];
  }

  // Al saltar a una sección con un enlace (#contacto, etc.), su contenido se ve
  // completo apenas llega: sin esperar la entrada ni verla a medio aparecer.
  const revelarDestino = (hash) => {
    if (!hash || hash.length < 2) return;
    let destino = null;
    try { destino = document.querySelector(hash); } catch (e) { return; }
    if (!destino) return;
    const seccion = destino.closest('.capitulo') || destino;
    const lista = [seccion].concat(Array.from(seccion.querySelectorAll("[data-escena='entrada']")))
      .filter((el) => el.dataset && el.dataset.escena === 'entrada');
    lista.forEach((el) => {
      el.classList.add('sin-transicion');
      mostrar(el);
      if (revelar) revelar.unobserve(el);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lista.forEach((el) => el.classList.remove('sin-transicion'));
    }));
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a) revelarDestino(a.getAttribute('href'));
  });
  if (location.hash) revelarDestino(location.hash);

  /* Pie: cortina y palabra gigante. La cortina (html.pie-cortina) deja el pie fijo debajo del
     contenido y se descubre al terminar #contacto; solo con alto >= 640 px y si el pie mide
     <= 100svh - 24 px (si no, el pie fluye normal). La palabra sube con animation-timeline en el
     CSS; acá queda el respaldo (.asomado) para los navegadores que no lo tienen. */
  const pieEl = document.querySelector('.footer');
  const marcaPie = pieEl ? pieEl.querySelector('.footer__marca') : null;
  const sinTimeline = !(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  let altoPie = 0;
  const calcularPie = () => {
    if (!pieEl) return;
    const cl = document.documentElement.classList;
    altoPie = pieEl.offsetHeight;
    const cabe = window.innerHeight >= 640 && altoPie <= window.innerHeight - 24;
    const activa = mov && cabe;
    if (cl.contains('pie-cortina') !== activa) cl.toggle('pie-cortina', activa);
    if (activa) document.documentElement.style.setProperty('--pie-alto', altoPie + 'px');
    else document.documentElement.style.removeProperty('--pie-alto');
  };
  // Con la cortina el pie está fijo y tapado: si un enlace del pie toma el foco, se baja al final
  if (pieEl) {
    pieEl.addEventListener('focusin', () => {
      if (document.documentElement.classList.contains('pie-cortina')) {
        window.scrollTo(0, document.documentElement.scrollHeight);
      }
    });
  }
  const pintarPie = (y, vh, total) => {
    if (!marcaPie || !sinTimeline || !mov) return;
    const faltan = total - (y + vh);
    const cortina = document.documentElement.classList.contains('pie-cortina');
    const asoma = cortina ? faltan < altoPie * 0.85 : pieEl.getBoundingClientRect().top < vh * 0.9;
    if (marcaPie.classList.contains('asomado') !== asoma) marcaPie.classList.toggle('asomado', asoma);
  };

  const medir = () => {
    altoBarra = header.offsetHeight;
    calcularPie();
  };

  let pendiente = false;
  // Último valor escrito por elemento, para no tocar el estilo si no cambió
  const ultimos = new WeakMap();

  const pintar = () => {
    pendiente = false;
    const vh = window.innerHeight;
    const y = window.scrollY;
    const alFinal = y + vh >= document.documentElement.scrollHeight - 2;

    // Primero se lee todo y después se escribe: mezclar lecturas y escrituras
    // obliga al navegador a recalcular el diseño varias veces por cuadro.
    const rects = continuas.map((el) => el.getBoundingClientRect());
    const rectsCap = capitulos.map((c) => c.getBoundingClientRect());
    const total = document.documentElement.scrollHeight;

    const valores = rects.map((r, i) => {
      let p;
      switch (continuas[i].dataset.escena) {
        case 'pin': p = -r.top / Math.max(1, r.height - vh); break;
        case 'paso': p = (vh - r.top) / (vh + r.height); break;
        default: p = (vh * 0.6 - r.top) / Math.max(1, r.height);
      }
      return clamp(p);
    });

    // Solo se escribe lo que cambió (las escenas lejos de la pantalla quedan quietas)
    continuas.forEach((el, i) => {
      const v = valores[i].toFixed(4);
      if (ultimos.get(el) === v) return;
      ultimos.set(el, v);
      el.style.setProperty('--p', v);
    });

    pintarPie(y, vh, total);

    // Al llegar al final, lo que quede por revelar se muestra
    if (alFinal && entradas.length) {
      entradas.forEach(mostrar);
      entradas = [];
    }

    // La barra toma el color del capítulo que tiene debajo
    const bajoBarra = altoBarra / 2;
    const actual = capitulos.find((c, i) => rectsCap[i].top <= bajoBarra && rectsCap[i].bottom > bajoBarra);
    const temaDe = (c) => (c ? c.dataset.tema : 'tinta');
    const temaBarra = temaDe(actual);
    if (menuBoton.getAttribute('aria-expanded') !== 'true' && header.dataset.tema !== temaBarra) header.dataset.tema = temaBarra;

    const centroEn = capitulos.find((c, i) => rectsCap[i].top <= vh / 2 && rectsCap[i].bottom > vh / 2);

    // WhatsApp flotante: aparece cuando se deja la portada (que ya tiene sus
    // acciones) y se va al llegar a Contacto (que ya tiene su propio enlace de WhatsApp).
    // Toma el tema del capítulo que tiene debajo.
    if (waFlotante && !waFlotante.hidden) {
      const visible = menuBoton.getAttribute('aria-expanded') !== 'true'
        && (iPortada < 0 || rectsCap[iPortada].bottom < vh * 0.5)
        && (iContacto < 0 || rectsCap[iContacto].top > vh * 0.75)
        && total - (y + vh) > altoPie * 0.6; // ni sobre el pie (la palabra gigante)
      if (waFlotante.classList.contains('is-visible') !== visible) waFlotante.classList.toggle('is-visible', visible);
      const bajoBoton = vh - 44;
      const temaWa = temaDe(capitulos.find((c, i) => rectsCap[i].top <= bajoBoton && rectsCap[i].bottom > bajoBoton));
      if (waFlotante.dataset.tema !== temaWa) waFlotante.dataset.tema = temaWa;
    }

    // Barra fija inferior (celular): pasada la portada y hasta Contacto, sin el índice abierto.
    // Toma el tema del capítulo que tiene debajo, como el WhatsApp flotante.
    if (barraCta) {
      const visibleBarra = menuBoton.getAttribute('aria-expanded') !== 'true'
        && iPortada >= 0 && rectsCap[iPortada].bottom < vh * 0.3
        && (iContacto < 0 || rectsCap[iContacto].top > vh);
      if (barraCta.classList.contains('is-visible') !== visibleBarra) barraCta.classList.toggle('is-visible', visibleBarra);
      const bajoBarraCta = vh - 36;
      const temaCta = temaDe(capitulos.find((c, i) => rectsCap[i].top <= bajoBarraCta && rectsCap[i].bottom > bajoBarraCta));
      if (barraCta.dataset.tema !== temaCta) barraCta.dataset.tema = temaCta;
    }

    // Sección actual en la barra (el capítulo que cruza el centro de la pantalla)
    const id = centroEn ? `#${centroEn.id}` : '';
    linksBarra.forEach((a) => {
      const es = a.getAttribute('href') === id;
      a.classList.toggle('is-actual', es);
      if (es) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const pedir = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(pintar);
    }
  };

  medir();
  pintar();
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); });
  window.addEventListener('load', () => { medir(); pedir(); });
  if (document.fonts) document.fonts.ready.then(() => { medir(); pedir(); });

  /* ── Botones magnéticos ──────────────────────────── */
  /* Siguen un poco al puntero; solo con mouse y con movimiento permitido. */
  if (mov && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetico').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.22;
        const dy = (e.clientY - r.top - r.height / 2) * 0.35;
        b.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ── Video con póster (inicio y Quiénes somos) ─────── */
  /* Mismo patrón en los dos: el HTML no tiene autoplay ni src (solo data-src). El video se pide por JS
     únicamente con movimiento permitido (html.mov) y sin ahorro de datos, y recién cuando corresponde
     (el inicio, después del load; Quiénes somos, al acercarse a la pantalla). Se frena solo fuera de
     pantalla y con la pestaña oculta. Dura más de 5 s: botón de pausa (WCAG 2.2.2). Con reduced-motion,
     sin JS o si falla, queda la imagen fija. */
  const raiz = document.documentElement;
  const vincularVideo = (zona, video, pausa, etiqueta, cuando) => {
    const con = navigator.connection;
    if (!zona || !video || !video.dataset.src || !raiz.classList.contains('mov') || (con && con.saveData)) return;
    let pausadoPorUsuario = false;
    let visible = false;
    let cargado = false;
    const sincronizar = () => {
      if (!cargado) return;
      if (pausadoPorUsuario || !visible || document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    const arrancar = () => {
      if (cargado) return;
      cargado = true;
      video.src = video.dataset.src;
      video.addEventListener('playing', () => {
        video.classList.add('hero__video--activo');
        if (pausa) pausa.hidden = false;
      }, { once: true });
      sincronizar();
    };
    if (pausa) {
      pausa.addEventListener('click', () => {
        pausadoPorUsuario = !pausadoPorUsuario;
        pausa.setAttribute('aria-pressed', String(pausadoPorUsuario));
        pausa.setAttribute('aria-label', `${pausadoPorUsuario ? 'Reanudar' : 'Pausar'} el video ${etiqueta}`);
        sincronizar();
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((lista) => {
        visible = lista[lista.length - 1].isIntersecting;
        if (cuando === 'visible' && visible) arrancar();
        sincronizar();
      }, { rootMargin: cuando === 'visible' ? '300px 0px' : '0px' }).observe(zona);
    } else {
      visible = true;
      if (cuando === 'visible') arrancar();
    }
    document.addEventListener('visibilitychange', sincronizar);
    if (cuando === 'load') {
      const lanzar = () => (window.requestIdleCallback ? requestIdleCallback(arrancar, { timeout: 2500 }) : setTimeout(arrancar, 800));
      if (document.readyState === 'complete') lanzar();
      else window.addEventListener('load', lanzar, { once: true });
    }
  };

  /* ── Inicio: video y parallax ─────────────────────── */
  const inicioEl = document.getElementById('inicio');
  if (inicioEl && raiz.classList.contains('mov')) {
    /* Se pide recién después del load, para no competir con la imagen LCP. */
    const video = inicioEl.querySelector('.hero__video');
    if (video) {
      const foto = inicioEl.querySelector('.hero__medio img');
      if (foto && foto.currentSrc) video.poster = foto.currentSrc; /* la misma foto ya cargada: sin pedido extra */
      vincularVideo(inicioEl, video, inicioEl.querySelector('.hero__pausa'), 'del inicio', 'load');
    }

    /* Parallax de respaldo (sin animation-timeline): escribe --py (0 a 1) mientras el inicio está a la vista.
       Con soporte lo hace el CSS solo y esto no corre (a menos que se fuerce la clase par-js). */
    const soporta = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    if (!soporta) raiz.classList.add('par-js');
    let encima = true;
    let cuadro = 0;
    const escribir = () => {
      cuadro = 0;
      if (soporta && !raiz.classList.contains('par-js')) return;
      const alto = inicioEl.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / alto));
      inicioEl.style.setProperty('--py', p.toFixed(3));
    };
    const alScroll = () => { if (!cuadro) cuadro = requestAnimationFrame(escribir); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((lista) => {
        const ahora = lista[lista.length - 1].isIntersecting;
        if (ahora === encima) return;
        encima = ahora;
        if (encima) window.addEventListener('scroll', alScroll, { passive: true });
        else window.removeEventListener('scroll', alScroll);
      }).observe(inicioEl);
    }
    window.addEventListener('scroll', alScroll, { passive: true });
  }

  /* ── Quiénes somos: video de ruta ─────────────────── */
  /* Arranca recién cuando la sección se acerca a la pantalla (lazy). */
  const quienesEl = document.getElementById('quienes');
  if (quienesEl) {
    vincularVideo(quienesEl, quienesEl.querySelector('.quienes__video'), quienesEl.querySelector('.quienes__pausa'), 'de Quiénes somos', 'visible');
  }

  /* ── Franja de servicios ──────────────────────────── */
  /* Loop de CSS (html.mov). Acá: el botón de pausa (WCAG 2.2.2) y la pausa fuera de pantalla.
     Sin movimiento o sin JS, el botón no existe y los ítems quedan quietos. */
  const franjaSec = document.getElementById('servicios');
  if (franjaSec && raiz.classList.contains('mov')) {
    const botonFranja = franjaSec.querySelector('.pausa');
    let porUsuario = false;
    let fuera = false;
    const aplicarFranja = () => franjaSec.classList.toggle('is-pausada', porUsuario || fuera);
    if (botonFranja) {
      botonFranja.hidden = false;
      botonFranja.addEventListener('click', () => {
        porUsuario = !porUsuario;
        botonFranja.setAttribute('aria-pressed', String(porUsuario));
        botonFranja.setAttribute('aria-label', porUsuario ? 'Reanudar la franja' : 'Pausar la franja');
        aplicarFranja();
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((lista) => {
        fuera = !lista[lista.length - 1].isIntersecting;
        aplicarFranja();
      }, { rootMargin: '100px 0px' }).observe(franjaSec);
    }
  }

  /* ── Cifras (componente reutilizable) ─────────────── */
  /* <span data-cifra="175" [data-prefijo=""] [data-sufijo=""] aria-hidden="true">175</span>
     Cuenta de 0 al valor en ~1200 ms, una sola vez, al entrar en pantalla (threshold .6). El ancho
     se reserva (tabular-nums y min-width en ch en el HTML) para que no haya CLS. Sin movimiento o
     sin JS queda el valor final del HTML. */
  const cifras = Array.from(document.querySelectorAll('[data-cifra]'));
  if (cifras.length && raiz.classList.contains('mov') && 'IntersectionObserver' in window) {
    const fmt = (el, n) => `${el.dataset.prefijo || ''}${n}${el.dataset.sufijo || ''}`;
    const contar = (el) => {
      const meta = parseInt(el.dataset.cifra, 10);
      const dur = 1200;
      const t0 = performance.now();
      const paso = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3); /* easeOutCubic */
        el.textContent = fmt(el, Math.round(meta * e));
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    };
    const obsCifras = new IntersectionObserver((lista) => {
      lista.forEach((e) => {
        if (!e.isIntersecting) return;
        obsCifras.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: 0.6 });
    cifras.forEach((el) => {
      el.textContent = fmt(el, 0);
      obsCifras.observe(el);
    });
  }

  /* ── Contact form ───────────────────────────────── */
  /* Se envía a Web3Forms (relay para hosting estático) con FormData y sin
     cabeceras propias: así el pedido es "simple" y no hay preflight OPTIONS.
     El sitio nunca abre el programa de correo por su cuenta: si el envío
     falla, el visitante conserva lo que escribió y elige cómo seguir
     (reintentar, copiar el correo, Gmail o su programa de correo).
     Nunca mostramos "mensaje enviado" si no se envió nada. */
  const form = document.getElementById('contactForm');
  if (form) {
    /* ── Pantallas: una pregunta por vez (sin JS todo queda en una sola página) ── */
    const progreso = form.querySelector('.form__progreso');
    const pasoTexto = document.getElementById('formPasoTexto');
    const barra = form.querySelector('.form__barra i');
    const nav = form.querySelector('.form__nav');
    const volver = document.getElementById('formVolver');
    const seguir = document.getElementById('formSeguir');
    const pasos = Array.from(form.querySelectorAll('.form__paso'));
    const TOTAL = pasos.length; // 6 preguntas + la revisión
    let pasoActual = 1;
    let editando = false; // vino de "Editar" en la revisión: Seguir vuelve a la revisión
    let atencionVista = false; // la pregunta opcional ya se pasó (con o sin respuesta)

    /* Tarjeta TU DIAGNÓSTICO: se arma con lo que se va eligiendo */
    const diag = document.getElementById('formDiag');
    const diagToggle = document.getElementById('diagToggle');
    const diagCuenta = document.getElementById('diagCuenta');
    const diagAnuncio = document.getElementById('diagAnuncio');
    const filas = diag ? Array.from(diag.querySelectorAll('.diag__ren')) : [];
    const ETIQUETAS = {
      costo: 'Te cuesta', rubro: 'Rubro', localidad: 'Localidad', atencion: 'Atendés hoy',
      cuando: 'Para cuándo', name: 'Nombre', contacto: 'Contacto',
    };
    const FILA_DE = { whatsapp: 'contacto', email: 'contacto' };
    const mqEscritorio = window.matchMedia('(min-width: 900px)');
    let diagAbierta = false;
    let ultimos = {};

    const leer = () => {
      const d = new FormData(form);
      const t = (k) => String(d.get(k) || '').trim();
      return {
        costo: d.getAll('costo').join(', '),
        rubro: t('rubro'),
        localidad: t('localidad'),
        atencion: d.getAll('atencion').join(', ') || (atencionVista ? 'Sin indicar' : ''),
        cuando: t('cuando'),
        name: t('name'),
        contacto: [t('whatsapp'), t('email')].filter(Boolean).join(' · '),
      };
    };
    const pintar = (v, animar = true) => {
      if (!diag) return;
      let listos = 0;
      filas.forEach((li) => {
        const k = li.dataset.fila;
        const valor = v[k] || '';
        const listo = valor !== '';
        if (listo) listos++;
        li.classList.toggle('is-listo', listo);
        const el = li.querySelector('.diag__v');
        const nuevo = listo ? valor : 'Pendiente';
        if (el.textContent !== nuevo) {
          el.textContent = nuevo;
          if (animar && listo) {
            li.classList.remove('is-nuevo');
            void li.offsetWidth;
            li.classList.add('is-nuevo');
          }
        }
      });
      const cuenta = `${listos} de ${filas.length}`;
      if (diagCuenta.textContent !== cuenta) {
        diagCuenta.textContent = cuenta;
        if (animar) { diagCuenta.classList.remove('is-nuevo'); void diagCuenta.offsetWidth; diagCuenta.classList.add('is-nuevo'); }
      }
      ultimos = v;
    };
    const refrescar = (animar = true) => pintar(leer(), animar);
    const estadoDiag = () => {
      if (!diag) return;
      const fija = mqEscritorio.matches || pasoActual === TOTAL || form.classList.contains('form--enviado');
      const abierta = fija || diagAbierta;
      diag.classList.toggle('diag--cerrada', !abierta);
      diagToggle.setAttribute('aria-expanded', String(abierta));
      diagToggle.disabled = fija;
    };
    const anunciar = (nombre) => {
      if (!diagAnuncio) return;
      const k = FILA_DE[nombre] || nombre;
      if (!(k in ETIQUETAS)) return;
      diagAnuncio.textContent = `Tu diagnóstico. ${ETIQUETAS[k]}: ${ultimos[k] || 'sin responder'}.`;
    };

    const irA = (n, enfocar) => {
      const nuevo = Math.min(TOTAL, Math.max(1, n));
      form.dataset.dir = enfocar ? (nuevo > pasoActual ? 'adelante' : 'atras') : 'ninguna';
      pasoActual = nuevo;
      if (pasoActual === TOTAL) editando = false;
      pasos.forEach((p) => p.classList.toggle('is-actual', Number(p.dataset.paso) === pasoActual));
      form.dataset.paso = String(pasoActual);
      if (pasoTexto) pasoTexto.textContent = `Paso ${pasoActual} de ${TOTAL}`;
      if (barra) barra.style.setProperty('--p', String(pasoActual / TOTAL));
      if (volver) volver.hidden = pasoActual === 1;
      if (seguir) {
        seguir.hidden = pasoActual === TOTAL;
        seguir.textContent = editando ? 'Volver a la revisión' : 'Seguir';
      }
      estadoDiag();
      if (!enfocar) return;
      const leyenda = pasos[pasoActual - 1].querySelector(':scope > legend, :scope > .form__rev-titulo');
      if (leyenda) leyenda.focus({ preventScroll: false });
      // El borde superior del formulario tiene que quedar a la vista, debajo de la barra
      const tope = form.getBoundingClientRect().top - header.offsetHeight - 8;
      if (tope < 0) window.scrollBy({ top: tope, behavior: 'auto' });
    };
    /* Cada pantalla se valida antes de avanzar: el navegador marca y enfoca el campo que falta */
    const validarPaso = () => {
      if (pasoActual === 1) {
        const cajas = Array.from(form.querySelectorAll('input[name="costo"]'));
        const alguna = cajas.some((c) => c.checked);
        cajas[0].setCustomValidity(alguna ? '' : 'Elegí al menos una opción.');
        if (!alguna) { cajas[0].reportValidity(); return false; }
        return true;
      }
      if (pasoActual === 2) {
        const rubroEl = form.elements.rubro;
        rubroEl.setCustomValidity(rubroEl.value.trim() === '' ? 'Completá este campo.' : '');
        if (!rubroEl.checkValidity()) { rubroEl.reportValidity(); return false; }
        return true;
      }
      if (pasoActual === 3 || pasoActual === 5) {
        const primero = form.querySelector(`input[name="${pasoActual === 3 ? 'localidad' : 'cuando'}"]`);
        if (!primero.checkValidity()) { primero.reportValidity(); return false; }
        return true;
      }
      if (pasoActual === 6) {
        validarLargos();
        const malo = ['name', 'whatsapp', 'email'].map((k) => form.elements[k]).find((c) => !c.checkValidity());
        if (malo) { malo.reportValidity(); return false; }
        return true;
      }
      return true;
    };
    const avanzar = () => {
      if (!validarPaso()) return;
      if (pasoActual === 4) { atencionVista = true; refrescar(); }
      irA(editando ? TOTAL : pasoActual + 1, true);
    };
    form.classList.add('form--pasos');
    if (progreso) progreso.hidden = false;
    if (nav) nav.hidden = false;
    pasos.forEach((p) => { if (p.classList.contains('form__revision')) p.hidden = false; });
    if (diag) {
      diag.hidden = false;
      refrescar(false);
      diagToggle.addEventListener('click', () => { diagAbierta = !diagAbierta; estadoDiag(); });
      mqEscritorio.addEventListener('change', estadoDiag);
      filas.forEach((li) => li.querySelector('.diag__editar').addEventListener('click', () => {
        editando = true;
        irA(Number(li.dataset.ir), true);
      }));
    }
    irA(1, false);
    if (seguir) seguir.addEventListener('click', avanzar);
    if (volver) volver.addEventListener('click', () => { editando = false; irA(pasoActual - 1, true); });
    form.addEventListener('input', () => refrescar());
    form.addEventListener('change', (e) => {
      if (e.target.name === 'costo') form.querySelector('input[name="costo"]').setCustomValidity('');
      refrescar();
      anunciar(e.target.name);
    });
    form.addEventListener('keydown', (e) => {
      const t = e.target;
      if (t.tagName !== 'INPUT' || t.closest('.form__hp')) return;
      // Enter avanza (no envía); en la revisión el envío es el botón
      if (e.key === 'Enter' && pasoActual < TOTAL) {
        e.preventDefault();
        avanzar();
        return;
      }
      // Flechas entre opciones de varias respuestas (en las de una sola, ya las maneja el navegador)
      if (t.type === 'checkbox' && ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        const grupo = Array.from(t.closest('.opciones').querySelectorAll('input'));
        const sig = grupo[(grupo.indexOf(t) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + grupo.length) % grupo.length];
        e.preventDefault();
        sig.focus();
      }
    });

    const submitBtn = form.querySelector('.btn--primary');
    const note = form.querySelector('.form__note');
    const alternativas = document.getElementById('formAlternativas');
    const aviso = document.getElementById('formAviso');
    const reintentar = document.getElementById('formReintentar');
    const copiar = document.getElementById('formCopiar');
    const copiado = document.getElementById('formCopiado');
    const correoTexto = document.getElementById('formCorreo');
    const gmail = document.getElementById('formGmail');
    const programa = document.getElementById('formPrograma');
    const gracias = document.getElementById('formGracias');
    const graciasTitulo = document.getElementById('formGraciasTitulo');
    /* Estado final: oculta el formulario, muestra "Gracias" con la salida por WhatsApp y lleva el foco al título */
    const graciasWa = document.getElementById('formGraciasWa');
    /* Mensaje de WhatsApp con un resumen de lo elegido (sin números) */
    const mensajeWa = (v) => {
      const partes = [
        'Hola studio74dev, pedí el diagnóstico gratis desde la web.',
        v.name && `Soy ${v.name}.`,
        v.rubro && `Rubro: ${v.rubro}${v.localidad ? ` (${v.localidad})` : ''}.`,
        !v.rubro && v.localidad && `Localidad: ${v.localidad}.`,
        v.costo && `Me cuesta: ${v.costo}.`,
        v.atencion && v.atencion !== 'Sin indicar' && `Hoy atiendo por: ${v.atencion}.`,
        v.cuando && `Lo necesito: ${v.cuando}.`,
      ].filter(Boolean);
      return partes.join(' ');
    };
    /* Reinicia el formulario y la tarjeta */
    const reiniciar = () => {
      form.reset();
      atencionVista = false;
      editando = false;
      refrescar(false);
      irA(1, false);
    };
    const mostrarGracias = (v) => {
      if (!gracias) return;
      form.classList.add('form--enviado');
      if (diag) {
        pintar(v, false);
        diag.classList.add('diag--enviada');
        diagCuenta.textContent = 'Enviado ✓';
        estadoDiag();
      }
      if (graciasWa) graciasWa.href = `${graciasWa.href.split('?')[0]}?text=${encodeURIComponent(mensajeWa(v))}`; // el número vive solo en el HTML
      gracias.hidden = false;
      if (graciasTitulo) graciasTitulo.focus();
    };
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    const originalNote = note ? note.textContent : '';
    const originalReintentar = reintentar ? reintentar.textContent : '';
    const originalCopiar = copiar ? copiar.textContent : '';
    const CONTACT_EMAIL = 'studio74dev@gmail.com';
    /* Relay de Web3Forms para el hosting estático.
       La access key se pide gratis en https://web3forms.com con el mail del
       estudio: llega un mail con la clave y se pega acá. Es fija y no vence. */
    const WEB3FORMS_KEY = 'da33bf64-6baa-4b58-a68c-bd3c23d7073a';
    const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
    const TIEMPO_MAXIMO = 12000; // ms por intento
    const ESPERA_REINTENTO = 1500; // ms antes del único reintento automático
    /* Largos máximos: los mismos que el maxlength de index.html */
    const LIMITES = { name: 80, email: 120, rubro: 80, whatsapp: 30 };
    const AVISOS = {
      fallo: 'No pudimos enviar tu consulta desde la página. Podés intentar de nuevo o escribirnos directamente.',
      limite: 'Hay demasiados envíos en este momento. Esperá un minuto e intentá de nuevo, o escribinos directamente.',
      ilegible: 'No pudimos enviar tu consulta desde la página. Podés intentar de nuevo en un minuto o escribirnos directamente.',
    };
    const CHECK_SVG = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <polyline points="20 6 9 17 4 12" />
        </svg>`;

    let stateTimer = null;
    let esperaTimer = null;
    let copiadoTimer = null;
    const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

    /* state: 'is-loading' | 'is-sent' | 'is-error' | null
       ms: 0 deja el estado fijo hasta el próximo envío. */
    const setState = (state, opts = {}) => {
      const { btn = null, note: noteText = null, ms = 4200, reset = false } = opts;
      clearTimeout(stateTimer);
      form.classList.remove('is-loading', 'is-sent', 'is-error');
      if (state) form.classList.add(state);
      if (submitBtn) {
        submitBtn.disabled = state === 'is-loading';
        if (btn) submitBtn.innerHTML = btn;
      }
      if (note && noteText) note.textContent = noteText;
      if (state === 'is-loading' || !ms) return;

      stateTimer = setTimeout(() => {
        form.classList.remove('is-sent', 'is-error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        if (note) note.textContent = originalNote;
        if (reset) reiniciar();
      }, ms);
    };

    /* Asunto y cuerpo con lo que el visitante cargó: para Gmail y el mailto */
    const armarCorreo = (data) => ({
      subject: `Diagnóstico desde la web — ${data.get('rubro') || ''} (${data.get('localidad') || ''})`,
      body: [
        `Nombre: ${data.get('name') || ''}`,
        `WhatsApp: ${data.get('whatsapp') || ''}`,
        `Correo: ${data.get('email') || ''}`,
        `Qué te está costando: ${data.getAll('costo').join(', ')}`,
        `Rubro: ${data.get('rubro') || ''}`,
        `Localidad: ${data.get('localidad') || ''}`,
        `Cómo atendés hoy: ${data.getAll('atencion').join(', ') || 'No indicó'}`,
        `Para cuándo: ${data.get('cuando') || ''}`,
      ].join('\n'),
    });

    const ocultarAlternativas = () => {
      clearInterval(esperaTimer);
      if (alternativas) alternativas.hidden = true;
      if (reintentar) {
        reintentar.disabled = false;
        reintentar.textContent = originalReintentar;
      }
    };

    /* Fallo definitivo: aviso con foco y las salidas a mano. Los campos quedan como estaban.
       Sin data (fallo interno), Gmail y el mailto quedan con el enlace simple del HTML. */
    const mostrarFallo = (data, tipo, espera = 0) => {
      setState('is-error', { btn: originalBtnHTML, ms: 0 });
      if (!alternativas) return;
      if (data) {
        const { subject, body } = armarCorreo(data);
        gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`
          + `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        programa.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      aviso.textContent = AVISOS[tipo] || AVISOS.fallo;
      copiado.textContent = '';
      alternativas.hidden = false;
      aviso.focus();

      // Retry-After: "Reintentar" espera lo que pide el servicio
      clearInterval(esperaTimer);
      if (espera > 0) {
        const hasta = Date.now() + espera * 1000;
        const contar = () => {
          const resta = Math.ceil((hasta - Date.now()) / 1000);
          if (resta <= 0) {
            clearInterval(esperaTimer);
            reintentar.disabled = false;
            reintentar.textContent = originalReintentar;
            return;
          }
          reintentar.disabled = true;
          reintentar.textContent = resta > 90 ? `Reintentar en ${Math.ceil(resta / 60)} min` : `Reintentar en ${resta} s`;
        };
        contar();
        esperaTimer = setInterval(contar, 1000);
      }
    };

    /* Vacío (solo espacios) o más largo que el límite: el campo queda inválido
       y el navegador muestra el aviso. maxlength no frena lo que llega por script. */
    const validarLargos = () => {
      Object.entries(LIMITES).forEach(([nombre, max]) => {
        const campo = form.elements[nombre];
        if (!campo) return;
        let aviso = '';
        if (campo.required && campo.value.trim() === '') aviso = 'Completá este campo.';
        else if (campo.value.length > max) aviso = `Usá como máximo ${max} caracteres.`;
        campo.setCustomValidity(aviso);
      });
      // Con uno de los dos alcanza: WhatsApp o correo
      const wa = form.elements.whatsapp;
      const mail = form.elements.email;
      if (wa && mail && !wa.validationMessage && wa.value.trim() === '' && mail.value.trim() === '') {
        wa.setCustomValidity('Dejanos tu WhatsApp o tu correo.');
      }
    };
    form.addEventListener('input', (e) => {
      if (e.target.name in LIMITES) e.target.setCustomValidity('');
    });

    const segundos = (retryAfter) => {
      const n = parseInt(retryAfter, 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    };

    /* Un intento contra Web3Forms. Devuelve el tipo de resultado:
       'ok' | 'recuperable' (tiempo agotado, 5xx) | 'definitivo' (4xx) | 'limite' (429 legible)
       | 'ilegible' (sin respuesta: red caída o un 429 que llega sin CORS) */
    const intentar = async (data) => {
      const payload = new FormData();
      payload.append('access_key', WEB3FORMS_KEY);
      payload.append('subject', armarCorreo(data).subject);
      payload.append('from_name', 'studio74dev · Web');
      payload.append('Nombre', data.get('name') || '');
      payload.append('WhatsApp', data.get('whatsapp') || '');
      payload.append('Correo', data.get('email') || '');
      if ((data.get('email') || '').trim() !== '') payload.append('replyto', data.get('email'));
      payload.append('Qué te está costando', data.getAll('costo').join(', '));
      payload.append('Rubro', data.get('rubro') || '');
      payload.append('Localidad', data.get('localidad') || '');
      payload.append('Cómo atendés hoy', data.getAll('atencion').join(', ') || 'No indicó');
      payload.append('Para cuándo', data.get('cuando') || '');
      payload.append('botcheck', ''); // vacío: una persona nunca marca la casilla

      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), TIEMPO_MAXIMO);
      try {
        const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: payload, signal: ctrl.signal });
        const info = await res.json().catch(() => null);
        // Web3Forms contesta { "success": true } solo si aceptó el envío.
        if (res.ok && info && info.success === true) return { tipo: 'ok' };
        if (res.status === 429) return { tipo: 'limite', espera: segundos(res.headers.get('Retry-After')) };
        if (res.status >= 500) return { tipo: 'recuperable' };
        return { tipo: 'definitivo' };
      } catch (err) {
        if (err && err.name === 'AbortError') return { tipo: 'recuperable' };
        // Sin respuesta legible: o no hay red, o Web3Forms cortó por límite (su 429
        // llega sin cabeceras CORS y el navegador no deja leerlo). No se reintenta.
        return { tipo: 'ilegible' };
      } finally {
        clearTimeout(timeout);
      }
    };

    const enviar = async () => {
      if (!submitBtn) return;
      if (form.classList.contains('is-loading') || form.classList.contains('is-sent')) return;

      validarLargos();
      if (!form.checkValidity()) {
        // Los campos de otras pantallas están ocultos: se vuelve a la primera que falta
        const falta = Array.from(form.querySelectorAll('input, select, textarea')).find((c) => !c.checkValidity());
        const paso = falta && falta.closest('.form__paso');
        if (paso) irA(Number(paso.dataset.paso), true);
        (falta || form).reportValidity();
        return;
      }

      // Honeypot lleno o botcheck marcado → bot: éxito falso, sin abrir nada.
      const hp = form.querySelector('[name="company"]');
      const botcheck = form.querySelector('[name="botcheck"]');
      if ((hp && hp.value.trim() !== '') || (botcheck && botcheck.checked)) {
        setState('is-sent', { btn: `${CHECK_SVG} Pedido enviado`, reset: true });
        return;
      }

      const data = new FormData(form);
      ocultarAlternativas();
      setState('is-loading', { btn: 'Enviando…', note: 'Enviando tu consulta…' });

      let r = await intentar(data);
      // Tiempo agotado o 5xx: un solo reintento. El 429 y lo ilegible no: empeoran el límite.
      if (r.tipo === 'recuperable') {
        await dormir(ESPERA_REINTENTO);
        r = await intentar(data);
      }

      if (r.tipo === 'ok') {
        setState('is-sent', {
          btn: `${CHECK_SVG} Pedido enviado`,
          note: 'Recibimos tu pedido. Te respondemos dentro de las 24 horas hábiles.',
          ms: 0,
        });
        const resumen = leer();
        form.reset();
        irA(1, false);
        mostrarGracias(resumen);
        return;
      }
      if (note) note.textContent = originalNote;
      mostrarFallo(data, r.tipo in AVISOS ? r.tipo : 'fallo', r.espera);
    };

    form.addEventListener('submit', async (e) => {
      // Primero se frena el envío nativo: pase lo que pase después, no sale por el action.
      try {
        e.preventDefault();
        await enviar();
      } catch (_) {
        mostrarFallo(null, 'fallo');
      }
    });

    if (reintentar) {
      reintentar.addEventListener('click', () => {
        if (typeof form.requestSubmit === 'function') form.requestSubmit(submitBtn);
        else if (submitBtn) submitBtn.click();
      });
    }

    /* Copiar correo: portapapeles si se puede; si no, queda seleccionado para copiarlo a mano */
    const avisarCopia = (texto) => {
      clearTimeout(copiadoTimer);
      copiado.textContent = texto;
      copiar.textContent = texto === 'Correo copiado' ? texto : originalCopiar;
      copiadoTimer = setTimeout(() => {
        copiar.textContent = originalCopiar;
        copiado.textContent = '';
      }, 3000);
    };
    const seleccionarCorreo = () => {
      const rango = document.createRange();
      rango.selectNodeContents(correoTexto);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(rango);
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      avisarCopia(ok ? 'Correo copiado' : 'Correo seleccionado: copialo desde el menú de tu navegador.');
    };
    if (copiar && correoTexto) {
      copiar.addEventListener('click', async () => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            avisarCopia('Correo copiado');
            return;
          } catch (_) { /* sin permiso: se selecciona */ }
        }
        seleccionarCorreo();
      });
    }
  }
})();
