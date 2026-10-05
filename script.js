(() => {
  const views = [...document.querySelectorAll('.view')];
  const links = [...document.querySelectorAll('nav a')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null, timer = null;
 
  function finish(prev, next, name) {
    if (prev) { prev.hidden = true; prev.classList.remove('out'); }
    next.hidden = false;
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
 