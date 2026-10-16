/* Stadtstücke. Prag – Router, Ansichten, Karten */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const t = key => I18N.t(key);
const l = obj => I18N.l(obj);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const placeById = id => PLACES.find(p => p.id === id);
const dishById = id => DISHES.find(d => d.id === id);
const byCat = cat => PLACES.filter(p => p.cat === cat);
const SECTIONS = ['karte', 'architektur', 'kunst', 'parks', 'essen', 'ausblicke'];

const state = { maps: [], homeScroll: 0, route: null };

/* ---------------------------------------------------------------- Bausteine */

function chapter(num) {
  return `<div class="chapter"><span class="chapter__num">${pad(num)}</span><span class="chapter__line"></span><span class="chapter__label">${esc(t('discover'))}</span></div>`;
}

function sectionHead(num, title, lead) {
  return `<header class="section__head">${chapter(num)}<h2 class="h2">${esc(title)}</h2><p class="lead">${esc(lead)}</p></header>`;
}

function distSlot(id) { return `<span class="dist" data-dist-for="${id}" hidden></span>`; }

function tile(p, { size = 'm', text = false } = {}) {
  return `<a class="tile tile--${size}" href="#/ort/${p.id}">
    <div class="tile__img"><img src="${p.img}" alt="${esc(l(p.title))}" loading="lazy" decoding="async"></div>
    <p class="tile__kicker"><span>${esc(l(p.label))}</span>${distSlot(p.id)}</p>
    <p class="tile__title">${esc(l(p.title))}</p>
    ${text ? `<p class="tile__text">${esc(l(p.short))}</p>` : ''}
  </a>`;
}

function note(p) {
  return `<a class="note" href="#/ort/${p.id}">
    <p class="note__title">${esc(l(p.title))}<span class="note__arrow" aria-hidden="true">↗</span></p>
    <p class="note__text">${esc(l(p.short))}</p>
    ${distSlot(p.id)}
  </a>`;
}

/* ---------------------------------------------------------------- Startseite */

function renderHome() {
  const U = UI[I18N.lang];
  const archTiles = ['st-nikolaus', 'prager-burg', 'veitsdom', 'astronomische-uhr', 'altstaedter-ring', 'karlsbruecke'].map(placeById);
  const artTiles = ['nationalmuseum', 'kafka-kopf', 'tanzendes-haus', 'lennon-mauer', 'schmalste-gasse', 'klein-venedig'].map(placeById);
  const viewTiles = ['zizkov', 'pulverturm', 'petrin-turm', 'terasa-u-prince'].map(placeById);

  return `
  <section class="hero wrap">
    <div class="hero__top">
      <div>
        <p class="hero__kicker">${esc(t('heroKicker'))}</p>
        <h1 class="hero__title">${esc(t('heroTitle'))}</h1>
      </div>
      <p class="hero__claim">${esc(t('heroClaim'))}</p>
    </div>
    <div class="hero__row">
      <div class="card facts">
        <p class="card__title">${esc(t('factsTitle'))}</p>
        <dl class="facts__grid">${U.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="facts__note">${esc(t('factsNote'))}</p>
      </div>
      <figure class="hero__img hero__img--wide"><a href="#/ort/karlsbruecke"><img src="img/hero-karlsbruecke.jpg" alt="${esc(t('cap1'))}"></a><figcaption>${esc(t('cap1'))}</figcaption></figure>
      <figure class="hero__img hero__img--narrow"><a href="#/ort/klein-venedig"><img src="img/hero-kleinseite.jpg" alt="${esc(t('cap2'))}"></a><figcaption>${esc(t('cap2'))}</figcaption></figure>
    </div>
  </section>

  <section class="section section--sand" id="karte">
    <div class="wrap">
      ${sectionHead(1, t('s1Title'), t('s1Lead'))}
      <div class="filters" role="toolbar" aria-label="${esc(t('nav').karte)}">
        <button type="button" class="chip is-active" data-filter="all">${esc(t('filterAll'))}</button>
        ${Object.keys(CATEGORIES).map(c => `<button type="button" class="chip" data-filter="${c}">${esc(l(CATEGORIES[c]))}</button>`).join('')}
      </div>
      <div class="overview">
        <div class="mapbox mapbox--overview">
          <div class="map" id="overview-map"></div>
          <div class="legend">
            <span><i class="legend__num"></i>${esc(t('legendStart'))}</span>
            <span><i class="legend__dot"></i>${esc(t('legendMore'))}</span>
            <span class="legend__me" hidden><i class="legend__self"></i>${esc(t('legendMe'))}</span>
          </div>
        </div>
        <div class="places">
          <h3 class="places__title">${esc(t('listTitle'))}</h3>
          <ol class="places__list">
            ${START_POINTS.map(p => `<li><a class="place-row" href="#/ort/${p.id}" data-place="${p.id}">
              <span class="place-row__num">${pad(p.n)}</span>
              <span class="place-row__body"><span class="place-row__name">${esc(l(p.listTitle || p.title))}</span><span class="place-row__sub">${esc(l(p.sub))}</span></span>
              ${distSlot(p.id)}
              <span class="place-row__arrow" aria-hidden="true">↗</span>
            </a></li>`).join('')}
          </ol>
          <button type="button" class="btn btn--ghost locate-btn" data-locate>
            <span class="locate-btn__icon" aria-hidden="true"></span><span data-locate-label>${esc(t('locate'))}</span>
          </button>
          <p class="locate-msg" data-locate-msg hidden></p>
        </div>
      </div>
      <p class="small">${esc(t('mapNote'))}</p>
    </div>
  </section>

  <section class="section" id="architektur">
    <div class="wrap">
      ${sectionHead(2, t('s2Title'), t('s2Lead'))}
      <div class="split">
        <div class="notes">
          <p class="kicker">${esc(t('s2Kicker'))}</p>
          ${['stadtbibliothek', 'strahov', 'nationaltheater'].map(id => note(placeById(id))).join('')}
        </div>
        <div class="grid grid--3">${archTiles.map(p => tile(p)).join('')}</div>
      </div>
    </div>
  </section>

  <section class="section section--white" id="kunst">
    <div class="wrap">
      ${sectionHead(3, t('s3Title'), t('s3Lead'))}
      <div class="split split--reverse">
        <div class="grid grid--3">${artTiles.map(p => tile(p)).join('')}</div>
        <aside class="card artnote">
          <p class="artnote__title">${esc(t('artNoteTitle'))}</p>
          <p class="artnote__text">${esc(t('artNoteText'))}</p>
          <div class="artnote__sub">
            <p class="note__title">${esc(t('artNoteSub'))}</p>
            <p class="note__text">${esc(t('artNoteSubText'))}</p>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section" id="parks">
    <div class="wrap">
      ${sectionHead(4, t('s4Title'), t('s4Lead'))}
      <div class="grid grid--3 grid--wide">${['letna', 'grebovka', 'petrin'].map(id => tile(placeById(id), { size: 'l', text: true })).join('')}</div>
    </div>
  </section>

  <section class="section section--sand" id="essen">
    <div class="wrap">
      ${sectionHead(5, t('s5Title'), t('s5Lead'))}
      <div class="food">
        <div class="notes">
          <p class="kicker">${esc(t('s5Kicker1'))}</p>
          ${byCat('essen').map(note).join('')}
          <p class="small">${esc(t('s5Note'))}</p>
        </div>
        <div class="dishes">
          <p class="kicker">${esc(t('s5Kicker2'))}</p>
          ${DISHES.map(d => `<a class="dish" href="#/gericht/${d.id}"><span class="dish__name">${esc(d.title)}</span><span class="dish__sub">${esc(l(d.sub))}</span></a>`).join('')}
        </div>
        <div class="grid grid--2 dish-photos">
          ${DISHES.map(d => `<a class="tile tile--dish" href="#/gericht/${d.id}"><div class="tile__img"><img src="${d.img}" alt="${esc(d.title)}" loading="lazy" decoding="async"></div><p class="tile__caption">${esc(d.title)}</p></a>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="ausblicke">
    <div class="wrap">
      ${sectionHead(6, t('s6Title'), t('s6Lead'))}
      <div class="grid grid--4">${viewTiles.map(p => tile(p, { size: 'l' })).join('')}</div>
      <a class="viewpoint" href="#/ort/opys">
        <img src="icons/arrow-up-right-red.svg" alt="" width="19" height="19">
        <span class="viewpoint__body"><span class="viewpoint__title">${esc(l(placeById('opys').title))}</span><span class="viewpoint__text">${esc(l(placeById('opys').short))}</span></span>
        ${distSlot('opys')}
      </a>
    </div>
  </section>`;
}

function mountHome() {
  const map = createMap('overview-map', { cooperative: true, bounds: boundsOf(START_POINTS), padding: 48 });
  const markers = [];

  PLACES.forEach(p => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = p.n ? 'pin pin--num' : 'pin pin--dot';
    el.setAttribute('aria-label', l(p.title));
    el.dataset.cat = p.cat;
    if (p.n) el.textContent = pad(p.n);
    const popup = new maplibregl.Popup({ offset: p.n ? 18 : 10, closeButton: false, maxWidth: '240px', className: 'pop' })
      .setHTML(popupHtml(p));
    const marker = new maplibregl.Marker({ element: el }).setLngLat([p.lon, p.lat]).setPopup(popup).addTo(map);
    markers.push({ p, marker, el });
  });

  /* Liste ↔ Karte: Hover auf eine Zeile hebt den Pin hervor */
  $$('.place-row').forEach(row => {
    const m = markers.find(x => x.p.id === row.dataset.place);
    row.addEventListener('mouseenter', () => m.el.classList.add('is-hot'));
    row.addEventListener('mouseleave', () => m.el.classList.remove('is-hot'));
  });

  /* Rubrik-Filter */
  $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    $$('[data-filter]').forEach(b => b.classList.toggle('is-active', b === btn));
    const shown = markers.filter(m => f === 'all' || m.p.cat === f);
    markers.forEach(m => {
      const on = shown.includes(m);
      m.el.classList.toggle('is-hidden', !on);
      if (!on && m.marker.getPopup().isOpen()) m.marker.togglePopup();
    });
    const pts = f === 'all' ? START_POINTS : shown.map(m => m.p);
    map.fitBounds(boundsOf(pts), { padding: 56, maxZoom: 15.5, duration: reduceMotion.matches ? 0 : 700 });
  }));

  attachUserMarker(map, { fitWith: null });
  bindLocateButtons();
}

function popupHtml(p) {
  return `<a class="pop__card" href="#/ort/${p.id}">
    ${p.img ? `<img src="${p.img}" alt="" loading="lazy">` : ''}
    <span class="pop__kicker">${esc(l(CATEGORIES[p.cat]))}</span>
    <span class="pop__title">${esc(l(p.title))}</span>
    <span class="pop__link">${esc(t('details'))} →</span>
  </a>`;
}

/* ---------------------------------------------------------------- Detailseite Ort */

function renderPlace(p) {
  const idx = PLACES.indexOf(p);
  const prev = PLACES[(idx - 1 + PLACES.length) % PLACES.length];
  const next = PLACES[(idx + 1) % PLACES.length];
  const nearby = PLACES.filter(x => x !== p)
    .map(x => ({ x, d: Geo.distance(p, x) }))
    .sort((a, b) => a.d - b.d).slice(0, 4);

  return `
  <article class="detail wrap">
    <a class="back" href="#/k/${p.cat === 'essen' ? 'essen' : p.cat}"><span aria-hidden="true">←</span> ${esc(t('back'))}</a>
    <header class="detail__head">
      <div class="chapter"><span class="chapter__num">${esc(l(CATEGORIES[p.cat]))}</span><span class="chapter__line"></span><span class="chapter__label">${esc(l(p.label))}</span></div>
      <h1 class="detail__title">${esc(l(p.title))}</h1>
      <p class="lead">${esc(l(p.sub))}</p>
    </header>

    <div class="detail__grid">
      <div class="detail__main">
        ${p.img ? `<figure class="detail__img"><img src="${p.img}" alt="${esc(l(p.title))}"></figure>` : ''}
        <div class="prose">${l(p.text).map(par => `<p>${esc(par)}</p>`).join('')}</div>
        <div class="card about">
          <p class="card__title">${esc(t('aboutTitle'))}</p>
          <dl class="facts__grid">
            <div><dt>${esc(t('fDistrict'))}</dt><dd>${esc(l(p.district))}</dd></div>
            <div><dt>${esc(t('fCategory'))}</dt><dd>${esc(l(CATEGORIES[p.cat]))}</dd></div>
            <div><dt>${esc(t('fEntry'))}</dt><dd>${esc(l(ENTRY[p.entry]))}</dd></div>
            <div><dt>${esc(t('fDuration'))}</dt><dd>${esc(l(p.duration))}</dd></div>
          </dl>
          <p class="about__tip"><span>${esc(t('fTip'))}</span>${esc(l(p.tip))}</p>
        </div>
      </div>

      <aside class="detail__side">
        <div class="mapbox mapbox--detail"><div class="map" id="detail-map"></div></div>
        ${wayPanel(p)}
        <section class="stops" aria-live="polite">
          <p class="kicker">${esc(t('stopsTitle'))}</p>
          <ul class="stops__list" data-stops><li class="stops__msg">${esc(t('stopsLoading'))}</li></ul>
        </section>
      </aside>
    </div>

    <section class="nearby">
      <h2 class="h3">${esc(t('nearbyTitle'))}</h2>
      <div class="grid grid--4">
        ${nearby.map(({ x, d }) => `<a class="near" href="#/ort/${x.id}">
          ${x.img ? `<div class="tile__img"><img src="${x.img}" alt="" loading="lazy"></div>` : `<div class="tile__img tile__img--empty"><span>${esc(l(CATEGORIES[x.cat]))}</span></div>`}
          <p class="tile__kicker"><span>${esc(l(CATEGORIES[x.cat]))}</span><span class="dist">${esc(fmtDistance(d))}</span></p>
          <p class="tile__title">${esc(l(x.title))}</p>
        </a>`).join('')}
      </div>
    </section>

    <nav class="pager" aria-label="${esc(t('prev'))} / ${esc(t('next'))}">
      <a href="#/ort/${prev.id}" class="pager__link"><span class="pager__dir">← ${esc(t('prev'))}</span><span class="pager__name">${esc(l(prev.title))}</span></a>
      <a href="#/ort/${next.id}" class="pager__link pager__link--next"><span class="pager__dir">${esc(t('next'))} →</span><span class="pager__name">${esc(l(next.title))}</span></a>
    </nav>
  </article>`;
}

function wayPanel(p) {
  return `<section class="way" aria-live="polite">
    <p class="kicker">${esc(t('wayTitle'))}</p>
    <div class="way__stats" data-way-stats hidden>
      <div><span class="way__label">${esc(t('distance'))}</span><span class="way__value" data-way-dist>–</span></div>
      <div><span class="way__label">${esc(t('walk'))}</span><span class="way__value" data-way-time>–</span></div>
    </div>
    <p class="way__msg" data-way-msg hidden></p>
    <button type="button" class="btn btn--primary locate-btn" data-locate>
      <span class="locate-btn__icon" aria-hidden="true"></span><span data-locate-label>${esc(t('locate'))}</span>
    </button>
    <p class="locate-msg" data-locate-msg hidden></p>
    <div class="way__links">
      <a class="btn btn--ghost" data-osm-link target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}">${esc(t('openOsm'))} ↗</a>
      <a class="btn btn--ghost" data-transit-link target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}&travelmode=transit">${esc(t('openTransit'))} ↗</a>
    </div>
  </section>`;
}

function mountPlace(p) {
  const map = createMap('detail-map', { center: [p.lon, p.lat], zoom: 15.6 });
  const el = document.createElement('div');
  el.className = 'pin pin--target';
  el.innerHTML = '<span></span>';
  new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lon, p.lat]).addTo(map);

  /* Weitere Orte als leise Punkte */
  PLACES.filter(x => x !== p).forEach(x => {
    const d = document.createElement('a');
    d.className = 'pin pin--dot pin--quiet';
    d.href = `#/ort/${x.id}`;
    d.title = l(x.title);
    d.setAttribute('aria-label', l(x.title));
    new maplibregl.Marker({ element: d }).setLngLat([x.lon, x.lat]).addTo(map);
  });

  attachUserMarker(map, { target: p });
  bindLocateButtons();
  loadStops(p, map);
}

/* Fußweg berechnen und zeichnen */
async function updateWay(p, map) {
  const pos = Geo.position;
  if (!pos) return;
  const stats = $('[data-way-stats]'), msg = $('[data-way-msg]');
  if (!stats) return;
  const air = Geo.distance(pos, p);
  stats.hidden = false;
  $('[data-transit-link]').href = `https://www.google.com/maps/dir/?api=1&origin=${pos.lat},${pos.lon}&destination=${p.lat},${p.lon}&travelmode=transit`;
  $('[data-osm-link]').href = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${pos.lat}%2C${pos.lon}%3B${p.lat}%2C${p.lon}`;

  if (Geo.distance(pos, PRAGUE_CENTER) > 25000) {
    $('[data-way-dist]').textContent = fmtDistance(air);
    $('[data-way-time]').textContent = '–';
    showMsg(msg, t('farAway'));
    return;
  }
  showMsg(msg, t('routeLoading'));
  try {
    const r = await Geo.walkingRoute(pos, p);
    if (state.route !== p.id) return;
    $('[data-way-dist]').textContent = fmtDistance(r.distance);
    $('[data-way-time]').textContent = fmtDuration(r.duration);
    msg.hidden = true;
    drawRoute(map, r.geometry);
  } catch (e) {
    if (state.route !== p.id) return;
    const est = Geo.estimateWalk(air);
    $('[data-way-dist]').textContent = '≈ ' + fmtDistance(est.distance);
    $('[data-way-time]').textContent = '≈ ' + fmtDuration(est.duration);
    showMsg(msg, t('routeFallback'));
    drawRoute(map, { type: 'LineString', coordinates: [[pos.lon, pos.lat], [p.lon, p.lat]] }, true);
  }
}

function showMsg(el, text) { if (el) { el.textContent = text; el.hidden = false; } }

function drawRoute(map, geometry, dashed = false) {
  const draw = () => {
    const data = { type: 'Feature', geometry, properties: {} };
    if (map.getSource('route')) {
      map.getSource('route').setData(data);
    } else {
      map.addSource('route', { type: 'geojson', data, lineMetrics: true });
      map.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#fffcf6', 'line-width': 8 } });
      map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#a44834', 'line-width': 4 } });
    }
    map.setPaintProperty('route', 'line-dasharray', dashed ? [1, 2] : null);
    const coords = geometry.coordinates;
    const b = coords.reduce((bb, c) => bb.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));
    map.fitBounds(b, { padding: 48, maxZoom: 16.5, duration: reduceMotion.matches ? 0 : 600 });
    if (!dashed) animateRoute(map);
  };
  map.loaded() ? draw() : map.once('load', draw);
}

/* Route „zeichnet“ sich einmal vom Standort zum Ziel – erklärende Bewegung, ease-in-out */
function animateRoute(map) {
  if (reduceMotion.matches) return;
  const easeInOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const start = performance.now(), dur = 900;
  const step = now => {
    if (!map.getLayer('route')) return;
    const k = Math.min(1, (now - start) / dur);
    const p = Math.max(0.0001, easeInOut(k));
    map.setPaintProperty('route', 'line-gradient',
      ['step', ['line-progress'], '#a44834', p, 'rgba(164,72,52,0)']);
    map.setPaintProperty('route-casing', 'line-gradient',
      ['step', ['line-progress'], '#fffcf6', p, 'rgba(255,252,246,0)']);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

async function loadStops(p, map) {
  const list = $('[data-stops]');
  try {
    const stops = await Geo.nearbyStops(p);
    if (state.route !== p.id) return;
    if (!stops.length) { list.innerHTML = `<li class="stops__msg">${esc(t('stopsNone'))}</li>`; return; }
    list.innerHTML = stops.map(s => `<li class="stop">
      <span class="stop__types">${s.types.map(ty => `<span class="badge badge--${ty}">${esc(t(ty))}</span>`).join('')}</span>
      <span class="stop__name">${esc(s.name)}</span>
      <span class="stop__dist">${esc(fmtDistance(s.distance))}</span>
    </li>`).join('');
    const addStops = () => stops.forEach(s => {
      const el = document.createElement('div');
      el.className = 'pin pin--stop';
      el.title = s.name;
      el.textContent = s.types[0] === 'metro' ? 'M' : s.types[0] === 'tram' ? 'T' : s.types[0] === 'funicular' ? 'L' : 'B';
      new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(map);
    });
    addStops();
  } catch (e) {
    if (state.route === p.id) list.innerHTML = `<li class="stops__msg">${esc(t('stopsError'))}</li>`;
  }
}

/* ---------------------------------------------------------------- Detailseite Gericht */

function renderDish(d) {
  const spots = byCat('essen');
  return `
  <article class="detail wrap">
    <a class="back" href="#/k/essen"><span aria-hidden="true">←</span> ${esc(t('back'))}</a>
    <header class="detail__head">
      <div class="chapter"><span class="chapter__num">${esc(l(CATEGORIES.essen))}</span><span class="chapter__line"></span><span class="chapter__label">${esc(t('dishKicker'))}</span></div>
      <h1 class="detail__title">${esc(d.title)}</h1>
      <p class="lead">${esc(l(d.sub))}</p>
    </header>
    <div class="detail__grid">
      <div class="detail__main">
        <figure class="detail__img"><img src="${d.img}" alt="${esc(d.title)}"></figure>
        <div class="prose">${l(d.text).map(par => `<p>${esc(par)}</p>`).join('')}</div>
      </div>
      <aside class="detail__side">
        <div class="mapbox mapbox--detail"><div class="map" id="detail-map"></div></div>
        <section class="way">
          <p class="kicker">${esc(t('dishWhere'))}</p>
          <p class="way__msg">${esc(t('dishWhereText'))}</p>
          <ol class="places__list">
            ${spots.map((s, i) => `<li><a class="place-row" href="#/ort/${s.id}">
              <span class="place-row__num">${pad(i + 1)}</span>
              <span class="place-row__body"><span class="place-row__name">${esc(l(s.title))}</span><span class="place-row__sub">${esc(l(s.sub))}</span></span>
              ${distSlot(s.id)}
              <span class="place-row__arrow" aria-hidden="true">↗</span>
            </a></li>`).join('')}
          </ol>
          <button type="button" class="btn btn--ghost locate-btn" data-locate>
            <span class="locate-btn__icon" aria-hidden="true"></span><span data-locate-label>${esc(t('locate'))}</span>
          </button>
          <p class="locate-msg" data-locate-msg hidden></p>
        </section>
      </aside>
    </div>
    <section class="nearby">
      <h2 class="h3">${esc(t('dishKicker'))}</h2>
      <div class="grid grid--4">
        ${DISHES.filter(x => x !== d).map(x => `<a class="near" href="#/gericht/${x.id}"><div class="tile__img"><img src="${x.img}" alt="" loading="lazy"></div><p class="tile__kicker"><span>${esc(l(x.sub))}</span></p><p class="tile__title">${esc(x.title)}</p></a>`).join('')}
      </div>
    </section>
  </article>`;
}

function mountDish() {
  const spots = byCat('essen');
  const map = createMap('detail-map', { bounds: boundsOf(spots), padding: 40 });
  spots.forEach((s, i) => {
    const el = document.createElement('a');
    el.className = 'pin pin--num';
    el.href = `#/ort/${s.id}`;
    el.textContent = pad(i + 1);
    el.setAttribute('aria-label', l(s.title));
    new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(map);
  });
  attachUserMarker(map, {});
  bindLocateButtons();
}

/* ---------------------------------------------------------------- Impressum & Datenschutz */

function renderLegal(page) {
  return `
  <article class="detail legal wrap">
    <a class="back" href="#/"><span aria-hidden="true">←</span> ${esc(t('backHome'))}</a>
    <header class="detail__head">
      <div class="chapter"><span class="chapter__num">${esc(l(page.kicker))}</span><span class="chapter__line"></span></div>
      <h1 class="detail__title">${esc(l(page.title))}</h1>
    </header>
    <div class="legal__body">${l(page.html)}</div>
  </article>`;
}

/* ---------------------------------------------------------------- Karten-Helfer */

function boundsOf(points) {
  const b = new maplibregl.LngLatBounds([points[0].lon, points[0].lat], [points[0].lon, points[0].lat]);
  points.forEach(p => b.extend([p.lon, p.lat]));
  return b;
}

function createMap(id, { center, zoom, bounds, padding = 40, cooperative = false } = {}) {
  const coop = t('coop');
  const map = new maplibregl.Map({
    container: id,
    style: MAP_STYLE,
    center: center || [14.4135, 50.0865],
    zoom: zoom || 14,
    bounds,
    fitBoundsOptions: { padding, maxZoom: 15.5 },
    minZoom: 10,
    maxZoom: 19,
    attributionControl: { compact: true },
    cooperativeGestures: cooperative,
    dragRotate: false,
    pitchWithRotate: false,
    locale: {
      'CooperativeGesturesHandler.WindowsHelpText': coop.win,
      'CooperativeGesturesHandler.MacHelpText': coop.mac,
      'CooperativeGesturesHandler.MobileHelpText': coop.mobile,
    },
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.on('error', e => console.warn('Karte:', e && e.error && e.error.message));
  /* Container ändert seine Größe, sobald Webfonts und Bilder geladen sind */
  const ro = new ResizeObserver(() => map.resize());
  ro.observe(map.getContainer());
  map.on('remove', () => ro.disconnect());
  state.maps.push(map);
  return map;
}

/* Eigener Standort als Punkt auf einer Karte */
function attachUserMarker(map, { target } = {}) {
  let marker = null;
  const update = pos => {
    if (!pos) return;
    if (!marker) {
      const el = document.createElement('div');
      el.className = 'me';
      el.setAttribute('aria-label', t('youAreHere'));
      el.innerHTML = '<span class="me__pulse"></span><span class="me__dot"></span>';
      marker = new maplibregl.Marker({ element: el }).setLngLat([pos.lon, pos.lat]).addTo(map);
      const legend = $('.legend__me');
      if (legend) legend.hidden = false;
    } else {
      marker.setLngLat([pos.lon, pos.lat]);
    }
    if (target) updateWay(target, map);
  };
  const off = Geo.onChange(update);
  map.on('remove', off);
  update(Geo.position);
}

/* ---------------------------------------------------------------- Standort-UI */

function bindLocateButtons() {
  $$('[data-locate]').forEach(btn => {
    btn.hidden = !!Geo.position && !btn.closest('.places');
    if (Geo.position) btn.classList.add('is-located');
    btn.addEventListener('click', async () => {
      const label = $('[data-locate-label]', btn);
      const msg = btn.parentElement.querySelector('[data-locate-msg]');
      label.textContent = t('locating');
      btn.disabled = true;
      try {
        await Geo.locate();
        if (msg) msg.hidden = true;
        btn.classList.add('is-located');
        if (!btn.closest('.places')) btn.hidden = true;
      } catch (code) {
        showMsg(msg, t(code === 'denied' ? 'locDenied' : code === 'insecure' ? 'locInsecure' : 'locError'));
      } finally {
        label.textContent = t('locate');
        btn.disabled = false;
      }
    });
  });
}

/* Entfernungen in Listen und Kacheln */
function updateDistances() {
  const pos = Geo.position;
  $$('[data-dist-for]').forEach(el => {
    const p = placeById(el.dataset.distFor);
    if (!pos || !p) { el.hidden = true; return; }
    el.textContent = fmtDistance(Geo.distance(pos, p));
    el.hidden = false;
  });
}
Geo.onChange(updateDistances);

/* ---------------------------------------------------------------- Navigation */

function renderNav() {
  const N = t('nav');
  const links = SECTIONS.map(s => `<a href="#/k/${s}">${esc(N[s])}</a>`).join('');
  $('[data-nav]').innerHTML = links;
  $('[data-nav-drawer]').innerHTML = links;
  $$('[data-lang]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === I18N.lang));
  });
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('[data-menu]').setAttribute('aria-label', t('menu'));
}

const drawer = {
  el: $('#drawer'),
  btn: $('[data-menu]'),
  open() {
    this.el.hidden = false;
    requestAnimationFrame(() => this.el.classList.add('is-open'));
    this.btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    const first = $('a', this.el);
    if (first) first.focus({ preventScroll: true });
  },
  close(immediate = false) {
    if (this.el.hidden) return;
    this.el.classList.remove('is-open');
    this.btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    const done = () => { this.el.hidden = true; };
    if (immediate || reduceMotion.matches) done();
    else setTimeout(done, 260);
  },
};
drawer.btn.addEventListener('click', () => (drawer.el.hidden ? drawer.open() : drawer.close()));
$('[data-menu-close]').addEventListener('click', () => drawer.close());
drawer.el.addEventListener('click', e => { if (e.target.closest('a')) drawer.close(true); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') drawer.close(true); });

$$('[data-lang]').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.lang === I18N.lang) return;
  I18N.set(b.dataset.lang);
  const y = window.scrollY;
  renderNav();
  route({ keepScroll: true, animate: false });
  window.scrollTo(0, y);
}));

$('[data-top]').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
});

/* ---------------------------------------------------------------- Router */

function destroyMaps() {
  state.maps.forEach(m => m.remove());
  state.maps = [];
}

let currentView = null;

function route({ keepScroll = false, animate = true } = {}) {
  const hash = location.hash.replace(/^#\/?/, '');
  const [kind, id] = hash.split('/');
  const app = $('#app');

  if (currentView === 'home' && !keepScroll) state.homeScroll = window.scrollY;

  destroyMaps();
  let view = 'home', title = 'Stadtstücke. ' + t('heroTitle');

  if (kind === 'ort' && placeById(id)) {
    const p = placeById(id);
    view = 'place'; title = `${l(p.title)} · Stadtstücke. ${t('heroTitle')}`;
    state.route = p.id;
    app.innerHTML = renderPlace(p);
    mountPlace(p);
  } else if (kind === 'gericht' && dishById(id)) {
    const d = dishById(id);
    view = 'dish'; title = `${d.title} · Stadtstücke. ${t('heroTitle')}`;
    state.route = d.id;
    app.innerHTML = renderDish(d);
    mountDish();
  } else if (LEGAL[kind]) {
    view = 'legal'; title = `${l(LEGAL[kind].title)} · Stadtstücke. ${t('heroTitle')}`;
    state.route = kind;
    app.innerHTML = renderLegal(LEGAL[kind]);
  } else {
    state.route = 'home';
    app.innerHTML = renderHome();
    mountHome();
  }
  document.title = title;
  updateDistances();

  if (animate && !keepScroll) {
    app.classList.remove('view-enter');
    void app.offsetWidth;
    app.classList.add('view-enter');
  }

  if (!keepScroll) {
    if (view === 'home' && kind === 'k' && id) {
      const target = document.getElementById(id);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    } else if (view === 'home' && currentView && currentView !== 'home') {
      window.scrollTo(0, state.homeScroll);
    } else {
      window.scrollTo(0, 0);
    }
  }
  currentView = view;
}

/* Abschnittslinks auf der Startseite: sanft scrollen, ohne neu zu rendern */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#/k/"]');
  if (!a || currentView !== 'home') return;
  const id = a.getAttribute('href').split('/')[2];
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  history.replaceState(null, '', a.getAttribute('href'));
  target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('hashchange', () => route());

I18N.init();
renderNav();
route({ animate: false });
Geo.restore();
