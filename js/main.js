/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT V11
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

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

  /* ── Canales pendientes ──────────────────────────── */
  /* Único lugar donde se cargan. Mientras estén vacíos, los bloques con
     data-canal quedan ocultos; al completarlos se muestran con su enlace. */
  const CANALES = {
    // Por partes, para que no quede escrito de corrido: código de país, sin "+" ni espacios.
    whatsapp: ['549', '2254', '42', '4691'].join(''),
    linkedin: 'https://www.linkedin.com/company/studio74dev/',
  };
  // Queda abierto a propósito: el visitante termina la frase
  const MENSAJE_WHATSAPP = 'Hola studio74dev, vengo de la web y quiero consultar por';

  const enlaces = {
    whatsapp: CANALES.whatsapp && `https://wa.me/${CANALES.whatsapp}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`,
    linkedin: CANALES.linkedin,
  };
  document.querySelectorAll('[data-canal]').forEach((bloque) => {
    const href = enlaces[bloque.dataset.canal];
    if (!href) return;
    // El bloque puede ser el enlace mismo (el botón flotante) o contenerlo
    const destinos = bloque.matches('a') ? [bloque] : bloque.querySelectorAll('a');
    destinos.forEach((a) => { a.href = href; });
    bloque.hidden = false;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Animaciones de scroll: solo si el <head> puso html.mov
  const mov = document.documentElement.classList.contains('mov');

  /* ── Intro: mini historia ────────────────────────── */
  /* Dura 2,2 s en CSS (la termina el animationend de intro-salida). Se guarda
     que ya se vio, y se saltea con un toque o una tecla. Si algo falla, un
     respaldo a los 2,6 s y una red de seguridad a los 4 s la quitan. */
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (intro && root.classList.contains('con-intro')) {
    let terminada = false;
    const quitar = () => {
      document.removeEventListener('pointerdown', saltear, true);
      document.removeEventListener('keydown', terminar, true);
    };
    const terminar = () => {
      if (terminada) return;
      terminada = true;
      root.classList.remove('con-intro');
      intro.remove();
      quitar();
    };
    // Toque: se cierra la intro y ese mismo toque (pointerup/click) no llega a lo de abajo
    const saltear = (e) => {
      if (terminada) return;
      e.preventDefault();
      terminar();
      const frenar = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
      document.addEventListener('click', frenar, { capture: true, once: true });
      setTimeout(() => document.removeEventListener('click', frenar, true), 400);
    };
    try {
      sessionStorage.setItem('s74-intro', '1');
    } catch (_) { /* sin storage: se vuelve a ver la próxima vez */ }

    intro.addEventListener('animationend', (e) => {
      if (e.animationName === 'intro-salida') terminar();
    });
    document.addEventListener('pointerdown', saltear, { capture: true });
    document.addEventListener('keydown', terminar, { once: true, capture: true });
    setTimeout(terminar, 2600);
    setTimeout(terminar, 4000);
  }

  /* ── Tema claro / oscuro ─────────────────────────── */
  /* El <head> ya puso html[data-theme] (lo guardado o el del sistema).
     El botón lo alterna y lo recuerda; si nunca se tocó, sigue al sistema. */
  const temaBoton = document.getElementById('temaBoton');
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const pintarTema = () => {
    const claro = root.dataset.theme === 'claro';
    if (temaBoton) temaBoton.setAttribute('aria-label', claro ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
    if (metaColor) metaColor.content = claro ? '#F4F3EF' : '#0B0B0C';
  };
  pintarTema();
  if (temaBoton) {
    temaBoton.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'claro' ? 'oscuro' : 'claro';
      try {
        localStorage.setItem('s74-tema', root.dataset.theme);
      } catch (_) { /* sin storage: vale para esta visita */ }
      pintarTema();
    });
  }
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let elegido = null;
    try { elegido = localStorage.getItem('s74-tema'); } catch (_) { /* sin storage */ }
    if (elegido) return;
    root.dataset.theme = e.matches ? 'claro' : 'oscuro';
    pintarTema();
  });

  /* ── Índice a pantalla completa ──────────────────── */
  const header = document.getElementById('header');
  const menuBoton = document.getElementById('menuBoton');
  const indice = document.getElementById('indice');
  let temaAntes = 'base';

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
    header.dataset.tema = 'base';
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
     También pinta el riel, el color de la barra y marca en la barra la
     sección que se está leyendo. */
  const escenas = Array.from(document.querySelectorAll('[data-escena]'));
  const capitulos = Array.from(document.querySelectorAll('.capitulo[data-tema]'));
  const riel = document.querySelector('.riel');
  const linksBarra = Array.from(document.querySelectorAll('.nav__links a'));
  const waFlotante = document.getElementById('waFlotante');
  const barraCta = document.getElementById('barraCta');
  if (barraCta) barraCta.hidden = false;
  const iPortada = capitulos.findIndex((c) => c.id === 'inicio');
  const iContacto = capitulos.findIndex((c) => c.id === 'contacto');
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const continuas = escenas.filter((el) => el.dataset.escena !== 'entrada');
  let entradas = escenas.filter((el) => el.dataset.escena === 'entrada');
  let altoBarra = header.offsetHeight;

  const mostrar = (el) => el.classList.add('visto');
  if ('IntersectionObserver' in window) {
    const revelar = new IntersectionObserver((lista) => {
      lista.forEach((e) => {
        if (!e.isIntersecting) return;
        mostrar(e.target);
        revelar.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    entradas.forEach((el) => revelar.observe(el));
  } else {
    entradas.forEach(mostrar);
    entradas = [];
  }

  const medir = () => {
    altoBarra = header.offsetHeight;
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

    // Al llegar al final, lo que quede por revelar se muestra
    if (alFinal && entradas.length) {
      entradas.forEach(mostrar);
      entradas = [];
    }

    // Barra y riel: toman el color del capítulo que tienen debajo
    const bajoBarra = altoBarra / 2;
    const actual = capitulos.find((c, i) => rectsCap[i].top <= bajoBarra && rectsCap[i].bottom > bajoBarra);
    const temaDe = (c) => (c ? c.dataset.tema : 'base');
    const temaBarra = temaDe(actual);
    if (menuBoton.getAttribute('aria-expanded') !== 'true' && header.dataset.tema !== temaBarra) header.dataset.tema = temaBarra;

    const rielEn = capitulos.find((c, i) => rectsCap[i].top <= vh / 2 && rectsCap[i].bottom > vh / 2);
    if (riel) {
      const temaRiel = temaDe(rielEn);
      if (riel.dataset.tema !== temaRiel) riel.dataset.tema = temaRiel;
      riel.style.setProperty('--progreso', clamp(y / Math.max(1, total - vh)).toFixed(4));
    }

    // WhatsApp flotante: aparece cuando se deja la portada (que ya tiene sus
    // acciones) y se va al llegar a Contacto (que tiene WhatsApp en sus canales).
    // Toma el tema del capítulo que tiene debajo, como el riel.
    if (waFlotante && !waFlotante.hidden) {
      const visible = menuBoton.getAttribute('aria-expanded') !== 'true'
        && (iPortada < 0 || rectsCap[iPortada].bottom < vh * 0.5)
        && (iContacto < 0 || rectsCap[iContacto].top > vh * 0.75);
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
    const id = rielEn ? `#${rielEn.id}` : '';
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

  /* ── "¿Le pasa esto?": tachado al llegar a cada solución ── */
  /* Solo con movimiento. Al entrar (o haber quedado arriba) la solución n,
     se marca .resuelto su dolor y su rótulo; una sola vez. */
  if (mov && 'IntersectionObserver' in window) {
    const tachar = new IntersectionObserver((lista) => {
      lista.forEach((e) => {
        const arriba = !e.isIntersecting && e.boundingClientRect.bottom <= 0;
        if (!e.isIntersecting && !arriba) return;
        const n = e.target.dataset.dolor;
        const dolor = document.querySelector(`#le-pasa .dolor[data-dolor="${n}"]`);
        if (dolor) dolor.classList.add('resuelto');
        const rotulo = e.target.querySelector('.solucion__dolor');
        if (rotulo) rotulo.classList.add('resuelto');
        tachar.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('#resolvemos .solucion[data-dolor]').forEach((el) => tachar.observe(el));
  }

  /* ── Antes / después de Matemar ──────────────────── */
  /* Sin JS los dos paneles quedan uno debajo del otro. Con JS se superponen y el
     deslizador mueve el corte (--corte). El centro de la manija (48 px) recorre
     el ancho menos media manija a cada lado, por eso el calc(). */
  const comparar = document.getElementById('comparar');
  const control = comparar && comparar.querySelector('.comparar__control');
  if (control) {
    const mover = () => {
      const v = Number(control.value);
      comparar.style.setProperty('--corte', `calc(24px + (100% - 48px) * ${v / 100})`);
      control.setAttribute('aria-valuetext', `Antes ${v} %, después ${100 - v} %`);
    };
    control.hidden = false;
    comparar.classList.add('comparar--activo');
    control.addEventListener('input', mover);
    mover();
  }

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

  /* ── Pestañas del sistema real ───────────────────── */
  const tabs = document.querySelectorAll('.app__tab');
  const vista = document.querySelector('#appVista img');
  const tabActual = () => document.querySelector('.app__tab.is-on');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    if (tab.classList.contains('is-on')) return;
    tabs.forEach((t) => {
      t.classList.toggle('is-on', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    const cambiar = () => {
      vista.src = tab.dataset.img;
      vista.alt = tab.dataset.alt;
      vista.classList.remove('is-cambiando');
    };
    if (reduceMotion) return cambiar();
    vista.classList.add('is-cambiando');
    setTimeout(cambiar, 220);
  }));

  /* ── Visor: la pantalla del sistema a tamaño real ── */
  const visor = document.getElementById('visor');
  const ampliar = document.getElementById('appAmpliar');
  if (visor && vista && typeof visor.showModal === 'function') {
    const visorImagen = document.getElementById('visorImagen');
    const abrirVisor = () => {
      visorImagen.src = vista.src;
      visorImagen.alt = vista.alt;
      document.getElementById('visorTitulo').textContent = tabActual() ? tabActual().textContent : '';
      visor.showModal();
      const lienzo = visor.querySelector('.visor__lienzo');
      lienzo.scrollLeft = 0;
      lienzo.scrollTop = 0;
    };
    ampliar.addEventListener('click', abrirVisor);
    vista.addEventListener('click', abrirVisor);
    // Tocar fuera de la imagen también cierra
    visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });
  } else if (ampliar) {
    ampliar.hidden = true;
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
    /* ── Pasos: 1 de 3 (sin JS todo queda en una sola página) ── */
    const progreso = form.querySelector('.form__progreso');
    const pasoTexto = document.getElementById('formPasoTexto');
    const barra = form.querySelector('.form__barra i');
    const nav = form.querySelector('.form__nav');
    const volver = document.getElementById('formVolver');
    const seguir = document.getElementById('formSeguir');
    const pasos = Array.from(form.querySelectorAll('.form__paso'));
    const TOTAL = pasos.length;
    let pasoActual = 1;
    const irA = (n, enfocar) => {
      pasoActual = Math.min(TOTAL, Math.max(1, n));
      pasos.forEach((p) => p.classList.toggle('is-actual', Number(p.dataset.paso) === pasoActual));
      form.dataset.paso = String(pasoActual);
      if (pasoTexto) pasoTexto.textContent = `Paso ${pasoActual} de ${TOTAL}`;
      if (barra) barra.style.setProperty('--p', String(pasoActual / TOTAL));
      if (volver) volver.hidden = pasoActual === 1;
      if (seguir) seguir.hidden = pasoActual === TOTAL;
      if (!enfocar) return;
      const leyenda = pasos[pasoActual - 1].querySelector(':scope > legend');
      if (leyenda) leyenda.focus({ preventScroll: false });
      // El borde superior del formulario tiene que quedar a la vista, debajo de la barra
      const tope = form.getBoundingClientRect().top - header.offsetHeight - 8;
      if (tope < 0) window.scrollBy({ top: tope, behavior: 'auto' });
    };
    const validarPaso = () => {
      if (pasoActual === 1) {
        const cajas = Array.from(form.querySelectorAll('input[name="costo"]'));
        const alguna = cajas.some((c) => c.checked);
        cajas[0].setCustomValidity(alguna ? '' : 'Elija al menos una opción.');
        if (!alguna) { cajas[0].reportValidity(); return false; }
        return true;
      }
      if (pasoActual === 2) {
        const rubroEl = form.elements.rubro;
        const loc = form.elements.localidad;
        rubroEl.setCustomValidity(rubroEl.value.trim() === '' ? 'Complete este campo.' : '');
        if (!rubroEl.checkValidity()) { rubroEl.reportValidity(); return false; }
        if (!loc.checkValidity()) { loc.reportValidity(); return false; }
        return true;
      }
      return true;
    };
    form.classList.add('form--pasos');
    if (progreso) progreso.hidden = false;
    if (nav) nav.hidden = false;
    irA(1, false);
    if (seguir) seguir.addEventListener('click', () => { if (validarPaso()) irA(pasoActual + 1, true); });
    if (volver) volver.addEventListener('click', () => irA(pasoActual - 1, true));
    form.addEventListener('change', (e) => {
      if (e.target.name === 'costo') form.querySelector('input[name="costo"]').setCustomValidity('');
    });
    // Enter en los pasos 1 y 2 avanza, no envía
    form.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || pasoActual === TOTAL) return;
      const t = e.target;
      if (t.tagName === 'INPUT' && (t.type === 'text' || t.type === 'checkbox')) {
        e.preventDefault();
        if (validarPaso()) irA(pasoActual + 1, true);
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
      fallo: 'No pudimos enviar su consulta desde la página. Puede intentar de nuevo o escribirnos directamente.',
      limite: 'Hay demasiados envíos en este momento. Espere un minuto e intente de nuevo, o escríbanos directamente.',
      ilegible: 'No pudimos enviar su consulta desde la página. Puede intentar de nuevo en un minuto o escribirnos directamente.',
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
        if (reset) { form.reset(); irA(1, false); }
      }, ms);
    };

    /* Asunto y cuerpo con lo que el visitante cargó: para Gmail y el mailto */
    const armarCorreo = (data) => ({
      subject: `Diagnóstico desde la web — ${data.get('rubro') || ''} (${data.get('localidad') || ''})`,
      body: [
        `Nombre: ${data.get('name') || ''}`,
        `WhatsApp: ${data.get('whatsapp') || ''}`,
        `Correo: ${data.get('email') || ''}`,
        `Qué le está costando: ${data.getAll('costo').join(', ')}`,
        `Rubro: ${data.get('rubro') || ''}`,
        `Localidad: ${data.get('localidad') || ''}`,
        `Cómo atiende hoy: ${data.getAll('atencion').join(', ') || 'No indicó'}`,
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
        if (campo.required && campo.value.trim() === '') aviso = 'Complete este campo.';
        else if (campo.value.length > max) aviso = `Use como máximo ${max} caracteres.`;
        campo.setCustomValidity(aviso);
      });
      // Con uno de los dos alcanza: WhatsApp o correo
      const wa = form.elements.whatsapp;
      const mail = form.elements.email;
      if (wa && mail && !wa.validationMessage && wa.value.trim() === '' && mail.value.trim() === '') {
        wa.setCustomValidity('Déjenos su WhatsApp o su correo.');
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
      payload.append('Qué le está costando', data.getAll('costo').join(', '));
      payload.append('Rubro', data.get('rubro') || '');
      payload.append('Localidad', data.get('localidad') || '');
      payload.append('Cómo atiende hoy', data.getAll('atencion').join(', ') || 'No indicó');
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
        form.reportValidity();
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
      setState('is-loading', { btn: 'Enviando…', note: 'Enviando su consulta…' });

      let r = await intentar(data);
      // Tiempo agotado o 5xx: un solo reintento. El 429 y lo ilegible no: empeoran el límite.
      if (r.tipo === 'recuperable') {
        await dormir(ESPERA_REINTENTO);
        r = await intentar(data);
      }

      if (r.tipo === 'ok') {
        setState('is-sent', {
          btn: `${CHECK_SVG} Pedido enviado`,
          note: 'Recibimos su pedido. Le respondemos dentro de las 24 horas.',
          ms: 8000,
          reset: true,
        });
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
      avisarCopia(ok ? 'Correo copiado' : 'Correo seleccionado: cópielo desde el menú de su navegador.');
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
