(() => {
  const views = [...document.querySelectorAll('.view')];
  const links = [...document.querySelectorAll('nav a')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null, timer = null;

  // Cards fade up as they scroll into view. Skipped when motion is reduced
  // or IntersectionObserver is missing, so cards are never left invisible.
  const tiles = [...document.querySelectorAll('.tile')];
  let io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    tiles.forEach(t => { t.classList.add('reveal'); io.observe(t); });
  }

  // Cards inside a view that was hidden may need a fresh look when it appears.
  function resetReveal(view) {
    if (!io) return;
    view.querySelectorAll('.tile').forEach(t => {
      t.classList.remove('show');
      io.unobserve(t);
      io.observe(t);
    });
  }

  function finish(prev, next, name) {
    if (prev) { prev.hidden = true; prev.classList.remove('out'); }
    next.hidden = false;
    resetReveal(next);
    next.classList.add('in');
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('in')));
    current = name;
    document.body.dataset.view = name;
    links.forEach(a => a.classList.toggle('on', a.dataset.v === name));
    window.scrollTo(0, 0);
  }

  function show() {
    let name = location.hash.slice(1);
    if (!views.some(v => v.id === name)) name = 'home';
    if (name === current) return;
    clearTimeout(timer);
    views.forEach(v => { if (v.id !== current && v.id !== name) { v.hidden = true; v.classList.remove('out', 'in'); } });
    const prev = current && document.getElementById(current);
    const next = document.getElementById(name);
    if (prev && !reduce) { prev.classList.add('out'); timer = setTimeout(() => finish(prev, next, name), 300); }
    else finish(prev, next, name);
  }

  addEventListener('hashchange', show);
  show();
})();