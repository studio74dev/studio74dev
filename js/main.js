/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT V10
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

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
    whatsapp: '', // TODO: número con código de país, sin "+" ni espacios. Ej.: '5492254123456'
    linkedin: 'https://www.linkedin.com/in/studio-dev-368410447/',
  };
  const MENSAJE_WHATSAPP = 'Hola, quisiera solicitar un presupuesto.';

  const enlaces = {
    whatsapp: CANALES.whatsapp && `https://wa.me/${CANALES.whatsapp}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`,
    linkedin: CANALES.linkedin,
  };
  document.querySelectorAll('[data-canal]').forEach((bloque) => {
    const href = enlaces[bloque.dataset.canal];
    if (!href) return;
    bloque.querySelectorAll('a').forEach((a) => { a.href = href; });
    bloque.hidden = false;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Animaciones de scroll: solo si el <head> puso html.mov
  const mov = document.documentElement.classList.contains('mov');

  /* ── Intro: carga, "Entrar" y apertura ───────────── */
  /* El contador sigue la carga real (página y fuentes), con un mínimo para
     que se vea la animación. Al llegar a 100 aparece "Entrar"; si nadie lo
     toca, entra solo. Al entrar, la pantalla se abre en dos y el 74 vuela
     hasta el logo de la barra. */
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (intro && root.classList.contains('con-intro')) {
    const marca = document.getElementById('introMarca');
    const destino = document.querySelector('.nav__logo-icon');
    const pct = document.getElementById('introPct');
    const entrar = document.getElementById('introEntrar');
    let estado = 'cargando';

    const terminar = () => {
      if (estado === 'fin') return;
      estado = 'fin';
      root.classList.remove('con-intro', 'intro-volando');
      intro.remove();
      try {
        sessionStorage.setItem('s74-intro', '1');
      } catch (_) { /* sin storage: se vuelve a ver la próxima vez */ }
    };

    const abrir = () => {
      if (estado === 'abriendo' || estado === 'fin') return;
      estado = 'abriendo';
      const a = marca.getBoundingClientRect();
      const b = destino.getBoundingClientRect();
      marca.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})`;
      intro.classList.add('is-abriendo');
      root.classList.add('intro-volando');
      root.classList.remove('con-intro');
      setTimeout(terminar, 1000);
    };

    // Carga real: espera al load y a las fuentes, con 1,2 s mínimos de animación
    const cargado = Promise.all([
      new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true }))),
      document.fonts ? document.fonts.ready.catch(() => { }) : Promise.resolve(),
    ]);
    let listo = false;
    cargado.then(() => { listo = true; });
    const t0 = performance.now();
    const contar = (t) => {
      if (estado !== 'cargando') return;
      const minimo = Math.min((t - t0) / 1200, 1);
      const valor = Math.floor((listo ? minimo : Math.min(minimo, 0.9)) * 100);
      pct.textContent = String(valor).padStart(2, '0');
      if (valor >= 100) {
        estado = 'lista';
        intro.classList.add('is-lista');
        entrar.focus({ preventScroll: true });
        setTimeout(abrir, 800);
        return;
      }
      requestAnimationFrame(contar);
    };
    requestAnimationFrame(contar);

    entrar.addEventListener('click', abrir);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') abrir();
    });
    // Red de seguridad: si algo traba la secuencia, la intro se va sola
    setTimeout(abrir, 8000);
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
    if (volverAlBoton) menuBoton.focus();
  };

  const abrirIndice = () => {
    indice.hidden = false;
    temaAntes = header.dataset.tema;
    header.dataset.tema = 'base';
    menuBoton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
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

  /* ── Visión: el manifiesto, palabra por palabra ──── */
  /* Cada palabra queda en un <span class="w"> con su índice; el CSS la
     enciende cuando el avance del capítulo llega a ella. */
  document.querySelectorAll('[data-palabras]').forEach((p) => {
    const palabras = p.textContent.trim().split(/\s+/);
    // El texto completo queda para lectores de pantalla; las palabras sueltas solo se ven
    p.innerHTML = `<span class="visually-hidden">${palabras.join(' ')}</span>` +
      palabras.map((w, i) => `<span class="w" style="--i:${i}" aria-hidden="true">${w}</span>`).join(' ');
    p.style.setProperty('--n', palabras.length);
  });

  /* ── Motor de scroll ─────────────────────────────── */
  /* Cada [data-escena] recibe --p entre 0 y 1 según el tipo:
     - pin: el capítulo es más alto que la pantalla; 0 cuando su borde de
       arriba toca el de la pantalla, 1 cuando su borde de abajo toca el de abajo.
     - entrada: no sigue al scroll; recibe la clase .visto una sola vez al aparecer
       y el CSS hace la transición (fluida aunque el dedo vaya rápido o lento).
     - paso: 0 cuando asoma por abajo, 1 cuando se fue por arriba.
     - recorrido: la línea del proceso, que avanza con el centro de la pantalla.
     También pinta el riel, el punto de la portada, el color de la barra y
     marca en la barra la sección que se está leyendo. */
  const escenas = Array.from(document.querySelectorAll('[data-escena]'));
  const capitulos = Array.from(document.querySelectorAll('.capitulo[data-tema]'));
  const riel = document.querySelector('.riel');
  const heroPunto = document.getElementById('heroPunto');
  const problema = document.querySelector('.problema');
  const pista = document.getElementById('problemaPista');
  const linksBarra = Array.from(document.querySelectorAll('.nav__links a'));
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const continuas = escenas.filter((el) => el.dataset.escena !== 'entrada');
  let entradas = escenas.filter((el) => el.dataset.escena === 'entrada');
  const indiceHero = continuas.findIndex((el) => el.contains(heroPunto));
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
    // Pista horizontal: lo que sobra a la derecha es lo que hay que recorrer
    if (problema && pista) {
      const sobra = Math.max(0, pista.scrollWidth - window.innerWidth);
      problema.style.setProperty('--distancia', `${sobra}px`);
      problema.style.setProperty('--alto', `calc(100svh + ${sobra}px)`);
    }
    // Punto de la portada: escala necesaria para cubrir toda la pantalla
    if (heroPunto) {
      heroPunto.style.removeProperty('--escala');
      ultimos.delete(heroPunto);
      const lado = heroPunto.getBoundingClientRect().width || 1;
      heroPunto.dataset.cubrir = String((Math.hypot(window.innerWidth, window.innerHeight) * 2.2) / lado);
    }
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

    // Portada: el punto crece en la segunda mitad del recorrido
    let escala = 1;
    if (heroPunto && mov && indiceHero >= 0) {
      const t = clamp((valores[indiceHero] - 0.4) / 0.6);
      const cubrir = parseFloat(heroPunto.dataset.cubrir) || 60;
      escala = 1 + (cubrir - 1) * t * t * t;
      const e = escala.toFixed(3);
      if (ultimos.get(heroPunto) !== e) {
        ultimos.set(heroPunto, e);
        heroPunto.style.setProperty('--escala', e);
      }
    }

    // Barra y riel: toman el color del capítulo que tienen debajo
    const bajoBarra = altoBarra / 2;
    const actual = capitulos.find((c, i) => rectsCap[i].top <= bajoBarra && rectsCap[i].bottom > bajoBarra);
    // Mientras el punto de la portada cubre la pantalla, ya es señal
    const cubierto = escala > 20;
    const temaDe = (c) => (!c ? 'base' : c.id === 'inicio' && cubierto ? 'senal' : c.dataset.tema);
    const temaBarra = temaDe(actual);
    if (menuBoton.getAttribute('aria-expanded') !== 'true' && header.dataset.tema !== temaBarra) header.dataset.tema = temaBarra;

    const rielEn = capitulos.find((c, i) => rectsCap[i].top <= vh / 2 && rectsCap[i].bottom > vh / 2);
    if (riel) {
      const temaRiel = temaDe(rielEn);
      if (riel.dataset.tema !== temaRiel) riel.dataset.tema = temaRiel;
      riel.style.setProperty('--progreso', clamp(y / Math.max(1, total - vh)).toFixed(4));
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

  /* ── Qué hacemos: el teléfono sigue al paso que se lee ── */
  const telefono = document.getElementById('telefono');
  const pasosRelato = document.querySelectorAll('.relato__paso');
  if (telefono && pasosRelato.length) {
    const activar = (paso) => {
      pasosRelato.forEach((p) => p.classList.toggle('is-activo', p === paso));
      telefono.dataset.paso = paso.dataset.paso;
    };
    activar(pasosRelato[0]);
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) activar(e.target); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pasosRelato.forEach((p) => observador.observe(p));
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

  /* ── Mensaje: crece con el texto ─────────────────── */
  /* Donde el navegador no tiene field-sizing, se ajusta a mano. */
  const mensaje = document.getElementById('message');
  if (mensaje && !CSS.supports('field-sizing', 'content')) {
    const crecer = () => {
      mensaje.style.height = 'auto';
      mensaje.style.height = `${mensaje.scrollHeight}px`;
    };
    mensaje.addEventListener('input', crecer);
  }

  /* ── Enlaces que preeligen el tipo de consulta ─────── */
  /* "Solicitar presupuesto" desde un servicio deja marcado ese servicio en el formulario. */
  document.querySelectorAll('[data-servicio]').forEach((a) => a.addEventListener('click', () => {
    const radio = document.querySelector(`#contactForm input[name="service"][value="${a.dataset.servicio}"]`);
    if (radio) radio.checked = true;
  }));

  /* ── Contact form ───────────────────────────────── */
  /* Se envía a Web3Forms (relay para hosting estático) con FormData y sin
     cabeceras propias: así el pedido es "simple" y no hay preflight OPTIONS.
     El sitio nunca abre el programa de correo por su cuenta: si el envío
     falla, el visitante conserva lo que escribió y elige cómo seguir
     (reintentar, copiar el correo, Gmail o su programa de correo).
     Nunca mostramos "mensaje enviado" si no se envió nada. */
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('.btn--primary');
    const note = form.querySelector('.form__note');
    const startedInput = form.querySelector('[name="started"]');
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
    const LIMITES = { name: 80, email: 120, message: 2000 };
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

    const refreshStarted = () => {
      if (startedInput) startedInput.value = String(Math.floor(Date.now() / 1000));
    };

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
        if (reset) {
          form.reset();
          refreshStarted();
        }
      }, ms);
    };

    refreshStarted();

    /* Asunto y cuerpo con lo que el visitante cargó: para Gmail y el mailto */
    const armarCorreo = (data) => ({
      subject: `Consulta desde la web — ${data.get('service') || 'Proyecto'}`,
      body: [
        `Nombre: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Tipo de proyecto: ${data.get('service') || ''}`,
        '',
        data.get('message') || '',
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
      payload.append('from_name', 'Studio 74 · Web');
      payload.append('name', data.get('name') || '');
      payload.append('email', data.get('email') || '');
      payload.append('replyto', data.get('email') || '');
      payload.append('Tipo de proyecto', data.get('service') || '');
      payload.append('message', data.get('message') || '');
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
        setState('is-sent', { btn: `${CHECK_SVG} Consulta enviada`, reset: true });
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
          btn: `${CHECK_SVG} Consulta enviada`,
          note: 'Consulta enviada. Le respondemos dentro de las 24 horas.',
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
