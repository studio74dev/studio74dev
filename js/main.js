/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT V7
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Canales pendientes ──────────────────────────── */
  /* Único lugar donde se cargan. Mientras estén vacíos, los bloques con
     data-canal quedan ocultos; al completarlos se muestran con su enlace. */
  const CANALES = {
    whatsapp: '', // TODO: número con código de país, sin "+" ni espacios. Ej.: '5492254123456'
    linkedin: '', // TODO: URL de la página del estudio. Ej.: 'https://www.linkedin.com/company/studio74dev/'
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

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');
  const navAnchors = document.querySelectorAll('.nav__link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Carga real: espera al load y a las fuentes, con 1,6 s mínimos de animación
    const cargado = Promise.all([
      new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true }))),
      document.fonts ? document.fonts.ready.catch(() => { }) : Promise.resolve(),
    ]);
    let listo = false;
    cargado.then(() => { listo = true; });
    const t0 = performance.now();
    const contar = (t) => {
      if (estado !== 'cargando') return;
      const minimo = Math.min((t - t0) / 1600, 1);
      const valor = Math.floor((listo ? minimo : Math.min(minimo, 0.9)) * 100);
      pct.textContent = String(valor).padStart(2, '0');
      if (valor >= 100) {
        estado = 'lista';
        intro.classList.add('is-lista');
        entrar.focus({ preventScroll: true });
        setTimeout(abrir, 2600);
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
  /* Arranca con el del dispositivo; el botón lo fija y se recuerda. */
  const botonTema = document.getElementById('tema');
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const temaActual = () => root.getAttribute('data-theme')
    || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const pintarTema = () => {
    const claro = temaActual() === 'light';
    botonTema.setAttribute('aria-label', claro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    metaColor.setAttribute('content', claro ? '#F6F8F4' : '#0A0A0B');
  };
  botonTema.addEventListener('click', () => {
    const nuevo = temaActual() === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nuevo);
    try {
      localStorage.setItem('s74-tema', nuevo);
    } catch (_) { /* sin storage: vale solo para esta visita */ }
    pintarTema();
  });
  pintarTema();

  /* ── Barra al hacer scroll ───────────────────────── */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ─────────────────────────────────── */
  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    navBackdrop.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-active');
    navBackdrop.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  navBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  navAnchors.forEach((a) => a.addEventListener('click', closeMenu));

  /* ── Active nav link on scroll ──────────────────── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
      });
    },
    { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' }
  );
  document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

  /* ── Pestañas del sistema real ───────────────────── */
  const tabs = document.querySelectorAll('.app__tab');
  const vista = document.querySelector('#appVista img');
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

  /* ── Reveal on scroll ───────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (child.hasAttribute('data-reveal')) child.style.setProperty('--reveal-delay', `${i * 90}ms`);
    });
  });

  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

  /* ── Enlaces que preeligen el tipo de consulta ─────── */
  /* "Solicitar presupuesto" desde un servicio deja marcado ese servicio en el formulario. */
  document.querySelectorAll('[data-servicio]').forEach((a) => a.addEventListener('click', () => {
    const radio = document.querySelector(`#contactForm input[name="service"][value="${a.dataset.servicio}"]`);
    if (radio) radio.checked = true;
  }));

  /* ── Contact form ───────────────────────────────── */
  /* Tres modos, en este orden:
     1. contact.php — hosting con PHP (Hostinger). No usa terceros.
     2. Web3Forms — relay para hosting estático (GitHub Pages), donde el PHP
        no corre. Usa una sola "access key" fija: a diferencia de FormSubmit,
        no hay activación por formulario ni mails de confirmación.
     3. mailto: — último recurso: abrimos el cliente de correo del
        visitante con el mensaje precargado.
     Nunca mostramos "mensaje enviado" si no se envió nada. */
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('.btn--primary');
    const note = form.querySelector('.form__note');
    const startedInput = form.querySelector('[name="started"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    const originalNote = note ? note.textContent : '';
    const CONTACT_EMAIL = 'studio74dev@gmail.com';
    /* Relay de Web3Forms para el hosting estático.
       La access key se pide gratis en https://web3forms.com con el mail del
       estudio: llega un mail con la clave y se pega acá. Es fija y no vence. */
    const WEB3FORMS_KEY = 'dcea2867-da4a-4854-b353-7538e8f4c5da';
    const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
    const CHECK_SVG = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <polyline points="20 6 9 17 4 12" />
        </svg>`;

    let stateTimer = null;

    const refreshStarted = () => {
      if (startedInput) startedInput.value = String(Math.floor(Date.now() / 1000));
    };

    /* state: 'is-loading' | 'is-sent' | 'is-error' | null */
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
      if (state === 'is-loading') return;

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

    const openMailto = (data) => {
      const subject = `Consulta desde la web — ${data.get('service') || 'Proyecto'}`;
      const body = [
        `Nombre: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Tipo de proyecto: ${data.get('service') || ''}`,
        '',
        data.get('message') || '',
      ].join('\n');
      const a = document.createElement('a');
      a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    /* 1) contact.php — hosting con PHP. Devuelve 'sent' | 'limit' | 'fail' */
    const sendViaPhp = async (data) => {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000);
        const res = await fetch('contact.php', {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: ctrl.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429) {
          const info = await res.json().catch(() => null);
          return {
            state: 'limit',
            message: (info && info.message) || 'Demasiados envíos seguidos. Intente nuevamente en unos minutos.',
          };
        }

        const info = await res.json().catch(() => null);
        return res.ok && info && info.ok ? { state: 'sent' } : { state: 'fail' };
      } catch (_) {
        // Sin PHP (GitHub Pages) o sin red: seguimos con el relay.
        return { state: 'fail' };
      }
    };

    /* 2) Web3Forms — relay para hosting estático, donde el PHP no corre.
        Sin key todavía: devuelve false y seguimos con el mailto. */
    const sendViaRelay = async (data) => {
      if (!WEB3FORMS_KEY) return false;
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Consulta desde la web — ${data.get('service') || 'Proyecto'}`,
            from_name: 'Studio 74 · Web',
            name: data.get('name') || '',
            email: data.get('email') || '',
            replyto: data.get('email') || '',
            'Tipo de proyecto': data.get('service') || '',
            message: data.get('message') || '',
          }),
        });
        clearTimeout(timeout);
        const info = await res.json().catch(() => null);
        // Web3Forms contesta { "success": true } solo si aceptó el envío.
        return res.ok && !!info && info.success === true;
      } catch (_) {
        return false;
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      if (form.classList.contains('is-loading') || form.classList.contains('is-sent')) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot lleno → bot: éxito falso, sin abrir nada.
      const hp = form.querySelector('[name="company"]');
      if (hp && hp.value.trim() !== '') {
        setState('is-sent', { btn: `${CHECK_SVG} Consulta enviada`, reset: true });
        return;
      }

      const data = new FormData(form);
      setState('is-loading', { btn: 'Enviando…' });

      const sent = () => setState('is-sent', { btn: `${CHECK_SVG} Consulta enviada`, reset: true });

      // 1) Hosting con PHP (Hostinger): envío propio, sin terceros.
      const php = await sendViaPhp(data);
      if (php.state === 'sent') return sent();
      if (php.state === 'limit') {
        setState('is-error', {
          btn: 'No se pudo enviar',
          note: php.message,
          ms: 6000,
        });
        return;
      }

      // 2) Hosting estático (GitHub Pages): relay por Web3Forms.
      if (await sendViaRelay(data)) return sent();

      // 3) Último recurso: abrimos el correo del visitante.
      openMailto(data);
      setState('is-sent', {
        btn: 'Se abrió su correo',
        note: 'El mensaje quedó listo en su aplicación de correo: solo resta enviarlo.',
        ms: 6000,
      });
    });
  }
})();
