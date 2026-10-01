// Sidebar-Inhaltsverzeichnis aus den <h2>, Scrollspy, Einklappen auf dem Handy, sanftes Einblenden.
(() => {
  const list = document.getElementById('toc-liste');
  const toggle = document.querySelector('.toc-toggle');
  const current = document.querySelector('.toc-current');
  const heads = [...document.querySelectorAll('main h2[id]')];

  if (list && heads.length && document.body.classList.contains('layout-projekt')) {
    const links = heads.map((h, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      const n = document.createElement('span');
      n.className = 'n';
      n.textContent = String(i + 1).padStart(2, '0');
      a.append(n, h.textContent.trim());
      li.append(a);
      list.append(li);
      return a;
    });

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      list.classList.toggle('open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

    // aktiver Abschnitt = letzte Überschrift, die das obere Drittel erreicht hat
    let active = -1;
    const spy = () => {
      const line = window.innerHeight * 0.3;
      let idx = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < line) idx = i; });
      if (idx === active) return;
      active = idx;
      links.forEach((a, i) => {
        a.classList.toggle('active', i === idx);
        if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      current.textContent = heads[idx].textContent.trim();
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { spy(); ticking = false; }); }
    }, { passive: true });
    spy();
  }

  // Einblenden beim Scrollen (per CSS abgeschaltet bei prefers-reduced-motion)
  const items = document.querySelectorAll('.plate, main > section, .karte');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.08 });
    items.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }
})();
