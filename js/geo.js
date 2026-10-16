/* Standort, Distanzen, Fußwege (FOSSGIS-OSRM) und Haltestellen (Overpass) */

const Geo = {
  position: null,           // { lat, lon, accuracy }
  listeners: new Set(),
  watchId: null,

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit() { this.listeners.forEach(fn => fn(this.position)); },

  /* Fragt den Standort an. resolve(position) | reject(code) */
  locate() {
    return new Promise((resolve, reject) => {
      if (!window.isSecureContext) return reject('insecure');
      if (!navigator.geolocation) return reject('error');
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.position = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy };
          try { localStorage.setItem('geoAllowed', '1'); } catch (e) { /* ignore */ }
          this.emit();
          this.watch();
          resolve(this.position);
        },
        err => reject(err.code === 1 ? 'denied' : 'error'),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
      );
    });
  },

  watch() {
    if (this.watchId != null || !navigator.geolocation) return;
    this.watchId = navigator.geolocation.watchPosition(pos => {
      const next = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy };
      /* nur bei spürbarer Bewegung neu rendern */
      if (!this.position || this.distance(this.position, next) > 25) { this.position = next; this.emit(); }
    }, () => {}, { enableHighAccuracy: true, maximumAge: 30000 });
  },

  /* Standort automatisch holen, wenn die Freigabe schon erteilt wurde */
  async restore() {
    try {
      if (!navigator.permissions || !window.isSecureContext) return;
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'granted') this.locate().catch(() => {});
    } catch (e) { /* ignore */ }
  },

  distance(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  },

  /* Schätzung: Luftlinie × 1,3 bei 4,8 km/h */
  estimateWalk(meters) { return { distance: meters * 1.3, duration: (meters * 1.3) / (4.8 / 3.6) }; },

  routeCache: new Map(),
  async walkingRoute(from, to) {
    const key = [from.lat, from.lon, to.lat, to.lon].map(n => n.toFixed(4)).join(',');
    if (this.routeCache.has(key)) return this.routeCache.get(key);
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetchWithTimeout(url, 10000);
    if (!res.ok) throw new Error('route ' + res.status);
    const data = await res.json();
    if (!data.routes || !data.routes.length) throw new Error('no route');
    const r = data.routes[0];
    /* Der FOSSGIS-Router rechnet mit ca. 5 km/h */
    const route = { distance: r.distance, duration: r.duration, geometry: r.geometry };
    this.routeCache.set(key, route);
    return route;
  },

  stopsCache: new Map(),
  /* Haltestellen kommen vorberechnet aus js/stops.js (OSM-Export). Overpass nur als Rückfall. */
  async nearbyStops(place, radius = 450) {
    if (this.stopsCache.has(place.id)) return this.stopsCache.get(place.id);
    const near = s => this.distance(place, { lat: s[2], lon: s[3] }) <= (s[1] === 'metro' || s[1] === 'funicular' ? radius + 250 : radius);
    let raw = (window.STOPS || []).filter(near);
    if (!raw.length) raw = (await this.overpassStops(place, radius)).filter(near);
    const byName = new Map();
    for (const [name, type, lat, lon] of raw) {
      const d = this.distance(place, { lat, lon });
      const e = byName.get(name) || { name, types: new Set(), distance: Infinity, lat, lon };
      e.types.add(type);
      if (d < e.distance) Object.assign(e, { distance: d, lat, lon });
      byName.set(name, e);
    }
    const order = { metro: 0, funicular: 1, tram: 2, bus: 3 };
    const list = [...byName.values()]
      .map(s => ({ ...s, types: [...s.types].sort((a, b) => order[a] - order[b]) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
    this.stopsCache.set(place.id, list);
    return list;
  },

  async overpassStops(place, radius) {
    const r2 = radius + 250, at = `${place.lat},${place.lon}`;
    const q = `[out:json][timeout:10];(node(around:${radius},${at})[railway=tram_stop];node(around:${radius},${at})[highway=bus_stop];node(around:${r2},${at})[railway=station][station~"^(subway|funicular)$"];);out body;`;
    const res = await fetchWithTimeout('https://overpass-api.de/api/interpreter', 12000, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(q),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) throw new Error('overpass ' + res.status);
    const data = await res.json();
    return data.elements.map(stopFromOsm).filter(Boolean);
  },
};

/* OSM-Knoten → [Name, Typ, lat, lon] */
function stopFromOsm(el) {
  const t = el.tags || {};
  if (!t.name || el.lat == null) return null;
  const type = t.station === 'subway' ? 'metro' : t.station === 'funicular' ? 'funicular'
    : t.railway === 'tram_stop' ? 'tram' : t.highway === 'bus_stop' ? 'bus' : null;
  return type ? [t.name, type, el.lat, el.lon] : null;
}

function fetchWithTimeout(url, ms, opts = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

function fmtDistance(m) {
  const t = I18N.t.bind(I18N);
  if (m < 950) return `${Math.max(10, Math.round(m / 10) * 10)} ${t('meters')}`;
  const km = m / 1000;
  const s = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return `${I18N.lang === 'de' ? s.replace('.', ',') : s} ${t('km')}`;
}

function fmtDuration(sec) {
  const t = I18N.t.bind(I18N);
  const min = Math.max(1, Math.round(sec / 60));
  if (min < 60) return `${min} ${t('min')}`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} ${t('h')} ${m} ${t('min')}` : `${h} ${t('h')}`;
}

/* Prag-Mittelpunkt für den „nicht in Prag“-Check */
const PRAGUE_CENTER = { lat: 50.0875, lon: 14.4213 };
