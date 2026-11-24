/* Roberto — Cantina di vino & birra */
(function () {
  'use strict';
  const L = window.RobertoLogic;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const nowIso = () => new Date().toISOString();
  const todayYmd = () => new Date().toISOString().slice(0, 10);

  /* ---------- iconen ---------- */
  const I = {
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    cellar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 21V9a8 8 0 0 1 16 0v12"/><path d="M4 21h16M8 21v-6a4 4 0 0 1 8 0v6"/><circle cx="10" cy="17.5" r=".8" fill="currentColor"/><circle cx="14" cy="17.5" r=".8" fill="currentColor"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 3h10l-.6 6.2A4.4 4.4 0 0 1 12 13.2a4.4 4.4 0 0 1-4.4-4L7 3z"/><path d="M7.4 7.5h9.2"/><path d="M12 13.2V20M8.5 21h7"/></svg>',
    plate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="13" r="6.5"/><circle cx="12" cy="13" r="3.8"/><path d="M2.5 3v6a2 2 0 0 0 2 2M4.5 3v18M21.5 3c-1.6 1-2 3-2 6h2v12"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2zM10 20a2 2 0 0 0 4 0"/></svg>',
    star: (fill) => `<svg viewBox="0 0 24 24"><defs><linearGradient id="h${fill}"><stop offset="${fill}" stop-color="#C9A45C"/><stop offset="${fill}" stop-color="#E2D5BE"/></linearGradient></defs><path fill="url(#h${fill})" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8z"/></svg>`,
  };
  const KLEUR = { rood: '#7E1F33', wit: '#D9C27A', rose: '#E3A3A8', mousserend: '#E6D49B', dessert: '#B86B2E' };
  function flesIcon(b) {
    if (b.soort === 'bier') {
      const c = /stout|porter|quad|dubbel|bruin|barley|imperial/.test(L.bottleText(b)) ? '#3B2210' : '#B8741F';
      return `<svg class="bicon" viewBox="0 0 30 44"><path d="M12 2h6v8c0 2 4 4 4 9v21a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V19c0-5 4-7 4-9V2z" fill="${c}"/><rect x="11.5" y="1" width="7" height="3" rx="1" fill="#C9A45C"/><rect x="9.5" y="23" width="11" height="10" rx="1.5" fill="#F4EBDD" opacity=".92"/><path d="M12 27h6M13 29.5h4" stroke="#9C7A3C" stroke-width=".8"/></svg>`;
    }
    const c = KLEUR[b.categorie] || KLEUR.rood;
    const neck = b.categorie === 'mousserend' ? '#C9A45C' : '#3E0F1C';
    return `<svg class="bicon" viewBox="0 0 30 44"><path d="M12.5 1h5v11c0 2 5 3.5 5 8.5V41a2 2 0 0 1-2 2H9.5a2 2 0 0 1-2-2V20.5c0-5 5-6.5 5-8.5V1z" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width=".6"/><rect x="12" y="0.5" width="6" height="6" rx="1" fill="${neck}"/><rect x="9" y="25" width="12" height="11" rx="1" fill="#FBF6EE" opacity=".95"/><path d="M11.5 29h7M12.5 31.5h5" stroke="#9C7A3C" stroke-width=".8"/></svg>`;
  }
  const starsHtml = v => { v = +v || 0; let s = ''; for (let i = 1; i <= 5; i++) s += v >= i ? '★' : v >= i - .5 ? '⯪' : '<span class="off">★</span>'; return `<span class="stars">${s.replace(/⯪/g, '<span style="background:linear-gradient(90deg,#C9A45C 50%,#dccfb9 50%);-webkit-background-clip:text;background-clip:text;color:transparent">★</span>')}</span>`; };

  /* ---------- data ---------- */
  const DEFAULT_SETTINGS = () => ({
    kast: {
      merk: 'Liebherr', model: 'EWTgb 3583 Vinidor', capaciteit: 83,
      zones: [{ id: 'z1', naam: 'Bovenzone', temp: '12 °C' }, { id: 'z2', naam: 'Onderzone', temp: '8 °C' }],
      planken: Array.from({ length: 10 }, (_, i) => ({ id: 'p' + (i + 1), naam: 'Plank ' + (i + 1), zone: i < 5 ? 'z1' : 'z2' })),
    },
    push: { publicKey: '' },
    namen: ['Rob', 'Marion'],
    updatedAt: '2000-01-01T00:00:00.000Z',
  });
  const emptyData = () => ({ version: 1, settings: DEFAULT_SETTINGS(), bottles: [], tastings: [], subscriptions: [] });
  const LS_DATA = 'roberto.data', LS_CFG = 'roberto.cfg';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
  };
  let data = store.get(LS_DATA, null) || emptyData();
  let cfg = store.get(LS_CFG, null) || { user: '', gh: { owner: '', repo: 'roberto-kelder', path: 'kelder.json', branch: 'main', token: '' } };
  const saveLocal = () => store.set(LS_DATA, data);
  const saveCfg = () => store.set(LS_CFG, cfg);
  const S = () => data.settings;
  const bottlesLive = () => data.bottles.filter(b => !b.deleted);
  const getBottle = id => data.bottles.find(b => b.id === id);

  function touch(o) { o.updatedAt = nowIso(); o.by = cfg.user || ''; }
  function changed() { saveLocal(); renderAll(); scheduleSync(); }

  /* ---------- samenvoegen (twee telefoons) ---------- */
  function mergeArr(a = [], b = [], key = 'id') {
    const m = new Map();
    for (const x of [...a, ...b]) { const k = x[key]; const cur = m.get(k); if (!cur || (x.updatedAt || '') > (cur.updatedAt || '')) m.set(k, x); }
    return [...m.values()].sort((x, y) => (x.createdAt || '').localeCompare(y.createdAt || '') || String(x[key]).localeCompare(String(y[key])));
  }
  function merge(a, b) {
    const sa = a.settings || DEFAULT_SETTINGS(), sb = b.settings || DEFAULT_SETTINGS();
    return {
      version: 1,
      settings: (sa.updatedAt || '') >= (sb.updatedAt || '') ? sa : sb,
      bottles: mergeArr(a.bottles, b.bottles), tastings: mergeArr(a.tastings, b.tastings), subscriptions: mergeArr(a.subscriptions, b.subscriptions),
    };
  }

  /* ---------- GitHub-opslag ---------- */
  const b64enc = s => { const by = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < by.length; i += 0x8000) bin += String.fromCharCode.apply(null, by.subarray(i, i + 0x8000)); return btoa(bin); };
  const b64dec = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), c => c.charCodeAt(0)));
  const GH = {
    on() { const g = cfg.gh || {}; return !!(g.token && g.owner && g.repo); },
    url() { const g = cfg.gh; return `https://api.github.com/repos/${encodeURIComponent(g.owner)}/${encodeURIComponent(g.repo)}/contents/${g.path.split('/').map(encodeURIComponent).join('/')}`; },
    headers() { return { Authorization: 'Bearer ' + cfg.gh.token.trim(), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }; },
    async get() {
      const r = await fetch(this.url() + '?ref=' + encodeURIComponent(cfg.gh.branch || 'main') + '&_=' + Date.now(), { headers: this.headers(), cache: 'no-store' });
      if (r.status === 404) return { data: null, sha: null };
      if (!r.ok) throw Object.assign(new Error('GitHub ' + r.status), { status: r.status });
      const j = await r.json();
      return { data: JSON.parse(b64dec(j.content)), sha: j.sha };
    },
    async put(obj, sha) {
      const body = { message: `Roberto: bijgewerkt door ${cfg.user || 'app'}`, content: b64enc(JSON.stringify(obj, null, 1)), branch: cfg.gh.branch || 'main' };
      if (sha) body.sha = sha;
      const r = await fetch(this.url(), { method: 'PUT', headers: { ...this.headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw Object.assign(new Error('GitHub ' + r.status), { status: r.status });
      return (await r.json()).content.sha;
    },
  };
  let syncing = false, again = false, syncTimer = null, lastSync = null, syncErr = '';
  function scheduleSync(ms = 1500) { clearTimeout(syncTimer); syncTimer = setTimeout(sync, ms); }
  function setDot(st) { const d = $('#syncdot'); if (d) d.className = 'syncdot ' + st; }
  async function sync(manual) {
    if (!GH.on()) { setDot('local'); if (manual) toast('Nog niet gekoppeld aan GitHub'); return; }
    if (syncing) { again = true; return; }
    syncing = true; setDot('busy');
    try {
      for (let i = 0; i < 4; i++) {
        const remote = await GH.get();
        const merged = remote.data ? merge(data, remote.data) : merge(data, emptyData());
        const remoteNorm = remote.data ? merge(remote.data, { settings: { updatedAt: '' } }) : null;
        data = merged; saveLocal(); renderAll();
        if (remoteNorm && JSON.stringify(remoteNorm) === JSON.stringify(merged)) break;
        try { await GH.put(merged, remote.sha); break; }
        catch (e) { if (e.status === 409 || e.status === 422) continue; throw e; }
      }
      lastSync = new Date(); syncErr = ''; setDot('ok');
      if (manual) toast('Gesynchroniseerd ✓');
    } catch (e) {
      syncErr = e.status === 401 ? 'Token ongeldig of verlopen' : e.status === 404 ? 'Repository niet gevonden (of geen toegang)' : e.status === 403 ? 'Geen schrijfrechten voor dit token' : (navigator.onLine ? e.message : 'Offline');
      setDot('err'); if (manual) toast('Sync mislukt: ' + syncErr);
    } finally { syncing = false; if (again) { again = false; scheduleSync(300); } }
  }

  /* ---------- UI helpers ---------- */
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600); }
  const sheetStack = [];
  function openSheet(title, html, onMount) {
    const bg = $('#sheetbg'), sh = document.createElement('div');
    sh.className = 'sheet';
    sh.innerHTML = `<div class="sheet-h"><h2>${title}</h2><button class="iconbtn" data-close aria-label="Sluiten">${I.close}</button></div><div class="sheet-b">${html}</div>`;
    document.body.appendChild(sh); sheetStack.push(sh);
    requestAnimationFrame(() => { bg.classList.add('open'); sh.classList.add('open'); });
    sh.querySelector('[data-close]').onclick = closeSheet;
    if (onMount) onMount(sh);
    return sh;
  }
  function closeSheet() {
    const sh = sheetStack.pop(); if (!sh) return;
    sh.classList.remove('open'); setTimeout(() => sh.remove(), 300);
    if (!sheetStack.length) $('#sheetbg').classList.remove('open');
  }
  function closeAllSheets() { while (sheetStack.length) closeSheet(); }

  const plankNaam = id => { const p = S().kast.planken.find(p => p.id === id); return p ? p.naam : 'Zonder plank'; };
  const zoneVan = id => { const p = S().kast.planken.find(p => p.id === id); return p ? S().kast.zones.find(z => z.id === p.zone) : null; };
  const subline = b => [b.producent, b.soort === 'bier' ? (b.stijl || 'Bier') : (b.jaargang || 'n.v.'), b.regio].filter(Boolean).map(esc).join(' · ');
  const totaal = list => list.reduce((s, b) => s + (+b.aantal || 0), 0);

  function bottleRow(b, extra = '') {
    const st = L.status(b);
    return `<div class="bottle" data-open="${b.id}">${flesIcon(b)}
      <div class="binfo"><div class="bname">${esc(b.naam)}${b.soort !== 'bier' && b.jaargang ? ' <span style="color:var(--gold-d)">' + esc(b.jaargang) + '</span>' : ''}</div>
      <div class="bsub">${subline(b)}${extra}</div>${b.vivinoScore ? `<div class="vscore">★ ${(+b.vivinoScore).toFixed(1).replace('.', ',')} ${b.soort === 'bier' ? 'Untappd' : 'Vivino'}</div>` : ''}</div>
      <div class="bside"><div class="qty">${+b.aantal || 0}<small>×</small></div>${st.key !== 'none' ? `<span class="pill ${st.key}">${st.label}</span>` : ''}</div></div>`;
  }
  function wireOpen(root) { $$('[data-open]', root).forEach(el => el.onclick = () => openDetail(el.dataset.open)); }

  /* ---------- Cantina ---------- */
  let filt = 'alles', q = '';
  const FILTERS = [['alles', 'Alles'], ['wijn', 'Wijn'], ['bier', 'Bier'], ['rood', 'Rood'], ['wit', 'Wit'], ['rose', 'Rosé'], ['mousserend', 'Bubbels'], ['dessert', 'Dessert'], ['klaar', "Op dronk"], ['op', 'Op = op']];
  function passes(b) {
    if (filt === 'op') { if (b.aantal > 0) return false; } else if (!(b.aantal > 0)) return false;
    if (filt === 'wijn' && b.soort === 'bier') return false;
    if (filt === 'bier' && b.soort !== 'bier') return false;
    if (['rood', 'wit', 'rose', 'mousserend', 'dessert'].includes(filt) && (b.soort === 'bier' || b.categorie !== filt)) return false;
    if (filt === 'klaar' && !['ready', 'peak', 'last'].includes(L.status(b).key)) return false;
    if (q && !L.bottleText(b).includes(q.toLowerCase()) && !String(b.jaargang || '').includes(q)) return false;
    return true;
  }
  function renderCantina() {
    const el = $('#p-cantina'), all = bottlesLive().filter(b => b.aantal > 0), k = S().kast;
    const nW = totaal(all.filter(b => b.soort !== 'bier')), nB = totaal(all.filter(b => b.soort === 'bier')), n = nW + nB;
    const pct = Math.min(100, Math.round(n / (k.capaciteit || 83) * 100));
    let html = `<div class="hero"><div class="it">La Cantina</div><div class="nl">${esc(k.merk)} ${esc(k.model)}</div></div>
      ${!GH.on() ? `<div class="banner">Alleen op deze telefoon opgeslagen. Koppel GitHub om samen met ${esc(S().namen.find(x => x !== cfg.user) || 'elkaar')} te delen.<button class="btn ghost" style="min-height:34px;padding:6px 10px" data-settings>Koppelen</button></div>` : ''}
      <div class="stats"><div class="stat"><b>${n}</b><small>flessen</small></div><div class="stat"><b>${nW}</b><small>wijn</small></div><div class="stat"><b>${nB}</b><small>bier</small></div><div class="stat"><b>${new Set(all.map(b => b.id)).size}</b><small>soorten</small></div></div>
      <div class="capbar"><i style="width:${pct}%"></i></div><div class="caplbl">${n} van ${k.capaciteit} plaatsen bezet (${pct}%)</div>
      <div class="search">${I.search}<input id="q" type="search" placeholder="Zoek op naam, druif, jaargang…" value="${esc(q)}"></div>
      <div class="chips">${FILTERS.map(([key, lbl]) => `<button class="chip ${filt === key ? 'on' : ''}" data-f="${key}">${lbl}</button>`).join('')}</div>`;
    const list = bottlesLive().filter(passes);
    if (!bottlesLive().length) {
      html += `<div class="empty"><div class="big">La cantina è vuota</div>Nog geen flessen. Tik op <b>+</b> om je eerste wijn of bier toe te voegen.<div class="btns" style="justify-content:center"><button class="btn ghost" id="demo">Voorbeeldkelder laden</button></div></div>`;
    } else if (!list.length) {
      html += `<div class="empty"><div class="big">Niets gevonden</div>Probeer een ander filter of zoekwoord.</div>`;
    } else {
      for (const z of k.zones) {
        const planken = k.planken.filter(p => p.zone === z.id);
        const inZone = list.filter(b => planken.some(p => p.id === b.plankId));
        if ((filt !== 'alles' || q) && !inZone.length) continue;
        html += `<section class="zone"><div class="zone-h"><h3>${esc(z.naam)}</h3><span>${esc(z.temp || '')} · ${totaal(inZone)} fl.</span></div>`;
        for (const p of planken) {
          const op = list.filter(b => b.plankId === p.id);
          if ((filt !== 'alles' || q) && !op.length) continue;
          html += `<div class="shelf"><div class="shelf-h">${esc(p.naam)}<span class="n">${totaal(op)} fl.</span></div>${op.length ? op.map(b => bottleRow(b)).join('') : '<div class="shelf-empty">leeg</div>'}</div>`;
        }
        html += `</section>`;
      }
      const los = list.filter(b => !k.planken.some(p => p.id === b.plankId));
      if (los.length) html += `<section class="zone"><div class="zone-h"><h3>Zonder plank</h3><span>${totaal(los)} fl.</span></div><div class="shelf">${los.map(b => bottleRow(b)).join('')}</div></section>`;
    }
    el.innerHTML = html;
    const qi = $('#q', el); qi.oninput = e => { q = e.target.value; const pos = qi.selectionStart; renderCantina(); const n2 = $('#q'); n2.focus(); n2.setSelectionRange(pos, pos); };
    $$('[data-f]', el).forEach(c => c.onclick = () => { filt = c.dataset.f; renderCantina(); });
    const d = $('#demo', el); if (d) d.onclick = loadDemo;
    const st = $('[data-settings]', el); if (st) st.onclick = openSettings;
    wireOpen(el);
  }

  /* ---------- Da bere (drinkadvies) ---------- */
  function renderBere() {
    const el = $('#p-bere'), now = L.ymNow(), nxt = L.addMonths(now, 1);
    const live = bottlesLive().filter(b => b.aantal > 0);
    const t = L.tijdVoor(live, now);
    const n = L.ymToIdx(now);
    const soon = live.filter(b => b.venster && !t.piek.includes(b) && !t.laatste.includes(b) && !t.over.includes(b))
      .filter(b => { const p = L.ymToIdx(b.venster.piek); return p > n + 1 && p <= n + 6; })
      .sort((a, b) => a.venster.piek.localeCompare(b.venster.piek));
    const ready = live.filter(b => ['ready', 'peak'].includes(L.status(b).key) && !t.piek.includes(b) && !soon.includes(b));
    const sec = (titel, lead, arr, extra) => arr.length ? `<div class="card"><h3>${titel}</h3><div class="lead">${lead}</div><div class="list" style="margin-top:6px">${arr.map(b => bottleRow(b, extra ? extra(b) : '')).join('')}</div></div>` : '';
    const count = t.piek.length + t.laatste.length + t.over.length;
    el.innerHTML = `<div class="hero"><div class="it">Da bere</div><div class="nl">${L.meseIt(now)} &amp; ${L.meseIt(nxt).split(' ')[0]}</div></div>
      ${count ? '' : `<div class="card"><h3>Tutto tranquillo</h3><div class="lead">Er hoeft deze en volgende maand niets per se open. Hieronder zie je wat eraan komt.</div></div>`}
      ${sec("Nu op z'n best", 'Deze of volgende maand op hun piek: perfect moment om te openen.', t.piek, b => ' · piek ' + L.fmtYm(b.venster.piek))}
      ${sec('Laatste kans', 'Het drinkvenster sluit binnen twee maanden.', t.laatste, b => ' · tot ' + L.fmtYm(b.venster.tot))}
      ${sec('Over de top', 'Volgens het advies voorbij hun beste moment. Snel opdrinken of zelf de datum aanpassen.', t.over, b => ' · tot ' + L.fmtYm(b.venster.tot))}
      ${sec('Binnenkort', 'Piek binnen zes maanden.', soon, b => ' · piek ' + L.fmtYm(b.venster.piek))}
      ${sec('Op dronk', 'Kan nu al prima open.', ready.slice(0, 12))}
      <div class="card"><h3>Meldingen</h3><div class="lead">${pushStatusText()}</div><div class="btns"><button class="btn ghost" data-settings>${I.bell} Instellen</button></div></div>`;
    wireOpen(el);
    $$('[data-settings]', el).forEach(b => b.onclick = () => openSettings('push'));
    const badge = $('#badge-bere'); badge.textContent = count; badge.classList.toggle('hidden', !count);
  }

  /* ---------- A tavola (spijs & drank) ---------- */
  let pairText = '', pairFilter = 'alles';
  const SNEL = ['Biefstuk', 'Pasta bolognese', 'Pizza', 'Stoofvlees', 'Kaasplank', 'Zalm', 'Mosselen', 'Curry', 'Wild', 'Eend', 'Risotto met paddenstoelen', 'Barbecue', 'Chocolade dessert', 'Borrel'];
  function renderTavola() {
    const el = $('#p-tavola');
    el.innerHTML = `<div class="hero"><div class="it">A tavola</div><div class="nl">Wat eten we vandaag?</div></div>
      <div class="pair-in"><textarea id="dish" placeholder="Bijv. ossenhaas met truffeljus en paddenstoelen…">${esc(pairText)}</textarea>
      <div class="seg" id="pf">${[['alles', 'Wijn & bier'], ['wijn', 'Alleen wijn'], ['bier', 'Alleen bier']].map(([k, l]) => `<button data-v="${k}" class="${pairFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="btns"><button class="btn gold block" id="pairgo">${I.glass} Kies uit de kast</button></div></div>
      <div class="chips" style="padding-top:12px">${SNEL.map(s => `<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div>
      <div id="pairres"></div>`;
    const ta = $('#dish', el);
    ta.oninput = () => { pairText = ta.value; };
    $('#pairgo', el).onclick = () => { pairText = ta.value; showPairing(); };
    $$('[data-s]', el).forEach(c => c.onclick = () => { pairText = c.dataset.s; ta.value = pairText; showPairing(); });
    $$('#pf button', el).forEach(b => b.onclick = () => { pairFilter = b.dataset.v; $$('#pf button', el).forEach(x => x.classList.toggle('on', x === b)); if (pairText) showPairing(); });
    if (pairText) showPairing();
  }
  function showPairing() {
    const out = $('#pairres');
    if (!pairText.trim()) { out.innerHTML = ''; return; }
    const { feats, results } = L.koppel(pairText, bottlesLive(), { filter: pairFilter });
    if (!bottlesLive().some(b => b.aantal > 0)) { out.innerHTML = `<div class="empty">Voeg eerst flessen toe aan de kast.</div>`; return; }
    let html = `<div class="ornament"><span>${feats.length ? 'Il consiglio' : 'Niet herkend'}</span></div>`;
    if (feats.length) html += `<div style="padding:0 18px 4px">${feats.map(f => `<span class="feat">${esc(f.naam)}</span>`).join('')}</div>`;
    else html += `<div class="card"><div class="lead">Ik herken het gerecht niet goed. Probeer de hoofdingrediënten te noemen, zoals <em>kip</em>, <em>lam</em>, <em>tomaat</em>, <em>room</em> of <em>vis</em>. Dit is wat nu het mooist op dronk is:</div></div>`;
    if (!results.length) html += `<div class="card"><div class="lead">Geen passende fles in de kast voor dit gerecht${pairFilter !== 'alles' ? ' (met dit filter)' : ''}. Tijd om te shoppen?</div></div>`;
    results.forEach((r, i) => {
      const pos = r.why.filter(w => !w.neg), neg = r.why.filter(w => w.neg);
      const tim = { peak: "en hij is nu op z'n best", last: 'en hij moet binnenkort op', ready: 'en hij is op dronk', young: 'maar eigenlijk nog te jong', over: 'en hij moet echt op', none: '' }[r.st.key];
      html += `<div class="card"><div class="match"><div class="rank">${i + 1}</div><div style="flex:1;min-width:0">${bottleRow(r.b)}
        <div class="why">${pos.map(w => `<em>${esc(cap(w.txt))}</em>`).join(' · ')}${tim ? ', ' + tim : ''}.${neg.length ? ' <span style="color:var(--bad)">Let op: ' + neg.map(w => esc(w.txt)).join(', ') + '.</span>' : ''}</div>
        <div class="btns" style="margin-top:10px"><button class="btn ghost" data-take="${r.b.id}">${I.glass} Deze openen we</button></div></div></div></div>`;
    });
    out.innerHTML = html; wireOpen(out);
    $$('[data-take]', out).forEach(b => b.onclick = () => openTasting(b.dataset.take, pairText));
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- Il diario ---------- */
  function renderDiario() {
    const el = $('#p-diario');
    const ts = data.tastings.filter(t => !t.deleted).sort((a, b) => (b.datum || '').localeCompare(a.datum || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
    const rated = ts.filter(t => t.cijfer > 0);
    const avg = rated.length ? rated.reduce((s, t) => s + +t.cijfer, 0) / rated.length : 0;
    const year = new Date().getFullYear();
    let html = `<div class="hero"><div class="it">Il diario</div><div class="nl">Wat we hebben gedronken</div></div>
      <div class="stats"><div class="stat"><b>${ts.length}</b><small>geproefd</small></div><div class="stat"><b>${ts.filter(t => (t.datum || '').startsWith(year)).length}</b><small>in ${year}</small></div><div class="stat"><b>${avg ? avg.toFixed(1).replace('.', ',') : '–'}</b><small>gem. cijfer</small></div></div>`;
    if (!ts.length) html += `<div class="empty"><div class="big">Nog niets geproefd</div>Open een fles via de kast of via <em>A tavola</em> en leg vast hoe hij was, met wie en bij welk gerecht.</div>`;
    else {
      const top = rated.slice().sort((a, b) => b.cijfer - a.cijfer).slice(0, 3);
      if (top.length >= 3) html += `<div class="card"><h3>Le migliori</h3><div class="lead">Jullie hoogst gewaardeerde flessen</div>${top.map(t => `<div class="tasting"><div class="t1"><div class="tn">${esc(t.fles.naam)} ${t.fles.jaargang ? esc(t.fles.jaargang) : ''}</div><div class="score">${(+t.cijfer).toFixed(1).replace('.', ',')}</div></div></div>`).join('')}</div>`;
      html += `<div class="card">${ts.map(t => `<div class="tasting" data-t="${t.id}">
        <div class="t1"><div style="min-width:0"><div class="tn">${esc(t.fles.naam)} ${t.fles.jaargang ? '<span style="color:var(--gold-d)">' + esc(t.fles.jaargang) + '</span>' : ''}</div>
        <div class="td">${fmtDate(t.datum)}${t.fles.producent ? ' · ' + esc(t.fles.producent) : ''}</div></div>
        <div style="text-align:right">${t.cijfer ? `<div class="score">${(+t.cijfer).toFixed(1).replace('.', ',')}</div>${starsHtml(t.cijfer)}` : ''}</div></div>
        ${t.metWie || t.gerecht ? `<div class="tw">${t.metWie ? 'Met ' + esc(t.metWie) : ''}${t.metWie && t.gerecht ? ' · ' : ''}${t.gerecht ? 'bij ' + esc(t.gerecht) : ''}</div>` : ''}
        ${t.notitie ? `<div class="tt">“${esc(t.notitie)}”</div>` : ''}</div>`).join('')}</div>`;
    }
    el.innerHTML = html;
    $$('[data-t]', el).forEach(x => x.onclick = () => openTasting(null, '', x.dataset.t));
  }
  const fmtDate = d => { if (!d) return ''; const [y, m, dd] = d.split('-'); return `${+dd} ${['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'][+m - 1]} ${y}`; };

  /* ---------- fles: detail ---------- */
  function vivinoUrl(b) {
    if (b.vivinoUrl) return b.vivinoUrl;
    const qq = [b.producent, b.naam, b.soort !== 'bier' ? b.jaargang : ''].filter(Boolean).join(' ');
    return b.soort === 'bier' ? 'https://untappd.com/search?q=' + encodeURIComponent(qq) : 'https://www.vivino.com/search/wines?q=' + encodeURIComponent(qq);
  }
  function windowBar(w) {
    const n = L.ymToIdx(L.ymNow()), v = L.ymToIdx(w.van), p = L.ymToIdx(w.piek), t = L.ymToIdx(w.tot);
    const a = Math.min(v, n) - 6, z = Math.max(t, n) + 6, span = z - a;
    const x = i => ((i - a) / span * 100).toFixed(1) + '%';
    const y0 = Math.floor(a / 12), y1 = Math.floor(z / 12);
    const step = Math.max(1, Math.ceil((y1 - y0) / 5));
    const ticks = []; for (let y = Math.ceil(a / 12); y <= y1; y += step) ticks.push(y);
    return `<div class="window"><div class="track"><div class="base"></div><div class="rng" style="left:${x(v)};width:calc(${x(t)} - ${x(v)})"></div><div class="pk" style="left:${x(p)}"></div><div class="now" style="left:${x(n)}">nu</div></div>
      <div class="ticks">${ticks.map(y => `<span>${y}</span>`).join('')}</div></div>`;
  }
  function openDetail(id) {
    const b = getBottle(id); if (!b) return;
    const st = L.status(b), z = zoneVan(b.plankId);
    const proeven = data.tastings.filter(t => !t.deleted && t.bottleId === id).sort((a, c) => (c.datum || '').localeCompare(a.datum || ''));
    const isBier = b.soort === 'bier';
    const f = (lbl, v) => v ? `<div class="fact"><small>${lbl}</small><span>${esc(v)}</span></div>` : '';
    const html = `<div class="dhead">${flesIcon(b)}<div><h3>${esc(b.naam)}</h3><div class="sub">${subline(b)}</div>${st.key !== 'none' ? `<span class="pill ${st.key}">${st.label}</span>` : ''}</div></div>
      <div class="facts">
        <div class="fact"><small>Plank</small><span>${esc(plankNaam(b.plankId))}${z ? ' · ' + esc(z.naam) : ''}</span></div>
        <div class="fact"><small>Aantal</small><div class="qtyctl"><button data-q="-1">−</button><span class="qty" id="qn">${+b.aantal || 0}</span><button data-q="1">+</button></div></div>
        ${f(isBier ? 'Stijl' : 'Soort', isBier ? b.stijl : ({ rood: 'Rood', wit: 'Wit', rose: 'Rosé', mousserend: 'Mousserend', dessert: 'Dessert / versterkt' }[b.categorie]))}
        ${f(isBier ? 'Gebotteld' : 'Druif', isBier ? (b.bottelDatum ? L.fmtYm(b.bottelDatum) : '') : b.druif)}
        ${f('Land', b.land)}${f('Alcohol', b.alcohol ? b.alcohol + '%' : '')}
        ${f('Prijs', b.prijs ? '€ ' + String(b.prijs).replace('.', ',') : '')}${f('Gekocht', b.aankoopDatum ? L.fmtYm(b.aankoopDatum) : '')}
        ${f(isBier ? 'Untappd' : 'Vivino', b.vivinoScore ? '★ ' + String(b.vivinoScore).replace('.', ',') : '')}
      </div>
      ${b.venster ? `<div class="advice"><div class="t">${b.venster.bron === 'handmatig' ? 'Jullie drinkvenster' : 'Roberto adviseert'}</div>
        <div class="d">Op dronk <b>${L.fmtYm(b.venster.van)}</b> – <b>${L.fmtYm(b.venster.tot)}</b>, piek rond <b>${L.fmtYm(b.venster.piek)}</b></div>
        ${windowBar(b.venster)}<div class="w">${esc(b.venster.bron === 'handmatig' ? 'Zelf aangepast.' : b.venster.uitleg || '')}</div></div>` : ''}
      ${b.notitie ? `<div class="card" style="margin:10px 0"><div class="tt" style="font-family:var(--serif);font-style:italic;font-size:17px">${esc(b.notitie)}</div></div>` : ''}
      <div class="btns"><button class="btn gold" id="d-open">${I.glass} Openen &amp; proeven</button></div>
      <div class="btns"><a class="btn ghost" href="${esc(vivinoUrl(b))}" target="_blank" rel="noopener">${I.ext} ${isBier ? 'Untappd' : 'Vivino'}</a><button class="btn ghost" id="d-edit">Bewerken</button></div>
      ${proeven.length ? `<div class="setsec">Eerder geproefd</div>${proeven.map(t => `<div class="tasting"><div class="t1"><div class="td">${fmtDate(t.datum)}${t.metWie ? ' · met ' + esc(t.metWie) : ''}</div>${t.cijfer ? `<div class="score">${(+t.cijfer).toFixed(1).replace('.', ',')}</div>` : ''}</div>${t.notitie ? `<div class="tt">“${esc(t.notitie)}”</div>` : ''}</div>`).join('')}` : ''}
      <div class="btns" style="margin-top:22px"><button class="btn danger" id="d-del">${I.trash} Verwijderen</button></div>
      <div class="small" style="margin-top:10px">Laatst gewijzigd ${b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('nl-NL') : ''}${b.by ? ' door ' + esc(b.by) : ''}</div>`;
    openSheet(isBier ? 'Birra' : 'Vino', html, sh => {
      $$('[data-q]', sh).forEach(x => x.onclick = () => { b.aantal = Math.max(0, (+b.aantal || 0) + +x.dataset.q); touch(b); $('#qn', sh).textContent = b.aantal; changed(); });
      $('#d-open', sh).onclick = () => openTasting(b.id);
      $('#d-edit', sh).onclick = () => { closeSheet(); openBottleForm(b.id); };
      $('#d-del', sh).onclick = () => { if (confirm(`"${b.naam}" verwijderen uit de kast?`)) { b.deleted = true; touch(b); closeSheet(); changed(); toast('Verwijderd'); } };
    });
  }

  /* ---------- fles: formulier ---------- */
  const BIERSTIJLEN = ['Pils / lager', 'Witbier', 'Weizen', 'Blond', 'Saison', 'IPA', 'NEIPA / hazy IPA', 'Double IPA', 'Pale ale', 'Dubbel', 'Tripel', 'Quadrupel', 'Bock', 'Stout', 'Imperial stout', 'Barrel aged imperial stout', 'Porter', 'Barley wine', 'Oude geuze', 'Kriek / fruitlambiek', 'Oud bruin / Flemish red', 'Wild ale / sour', 'Doppelbock / Eisbock'];
  function openBottleForm(id) {
    const ex = id ? getBottle(id) : null;
    const b = ex ? JSON.parse(JSON.stringify(ex)) : { soort: 'wijn', categorie: 'rood', aantal: 1, plankId: S().kast.planken[0]?.id, aankoopDatum: L.ymNow() };
    let manual = b.venster?.bron === 'handmatig';
    const k = S().kast;
    const plankOpts = k.zones.map(z => `<optgroup label="${esc(z.naam)}">${k.planken.filter(p => p.zone === z.id).map(p => `<option value="${p.id}" ${b.plankId === p.id ? 'selected' : ''}>${esc(p.naam)}</option>`).join('')}</optgroup>`).join('');
    const html = `<div class="seg" id="soort"><button data-v="wijn" class="${b.soort !== 'bier' ? 'on' : ''}">🍷 Wijn</button><button data-v="bier" class="${b.soort === 'bier' ? 'on' : ''}">🍺 Bier</button></div>
      <div class="f"><label>Naam *</label><input id="naam" value="${esc(b.naam)}" placeholder="Bijv. Barolo Bussia of Westvleteren 12" autocomplete="off"></div>
      <div class="f"><label id="lprod">${b.soort === 'bier' ? 'Brouwerij' : 'Producent / domein'}</label><input id="producent" value="${esc(b.producent)}"></div>
      <div class="w-only row"><div class="f"><label>Soort</label><select id="categorie">${[['rood', 'Rood'], ['wit', 'Wit'], ['rose', 'Rosé'], ['mousserend', 'Mousserend'], ['dessert', 'Dessert / versterkt']].map(([v, l]) => `<option value="${v}" ${b.categorie === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="f"><label>Jaargang</label><input id="jaargang" type="number" inputmode="numeric" min="1900" max="2100" value="${esc(b.jaargang)}" placeholder="n.v."></div></div>
      <div class="w-only f"><label>Druif / druiven</label><input id="druif" value="${esc(b.druif)}" placeholder="Bijv. Nebbiolo"></div>
      <div class="b-only row"><div class="f"><label>Stijl</label><input id="stijl" list="stijlen" value="${esc(b.stijl)}" placeholder="Bijv. Quadrupel"><datalist id="stijlen">${BIERSTIJLEN.map(s => `<option value="${s}">`).join('')}</datalist></div>
        <div class="f"><label>Gebotteld</label><input id="bottelDatum" type="month" value="${esc(b.bottelDatum)}"></div></div>
      <div class="row"><div class="f"><label>Land</label><input id="land" value="${esc(b.land)}"></div><div class="f"><label>Regio / appellatie</label><input id="regio" value="${esc(b.regio)}"></div></div>
      <div class="row"><div class="f"><label>Aantal</label><input id="aantal" type="number" inputmode="numeric" min="0" value="${esc(b.aantal)}"></div><div class="f"><label>Plank</label><select id="plankId">${plankOpts}</select></div></div>
      <div class="row"><div class="f"><label>Prijs (€)</label><input id="prijs" type="number" inputmode="decimal" step="0.01" value="${esc(b.prijs)}"></div><div class="f"><label>Alcohol %</label><input id="alcohol" type="number" inputmode="decimal" step="0.1" value="${esc(b.alcohol)}"></div></div>
      <div class="f"><label>Gekocht</label><input id="aankoopDatum" type="month" value="${esc(b.aankoopDatum)}"></div>
      <div class="advice" id="adv"></div>
      <label class="switch"><input type="checkbox" id="manual" ${manual ? 'checked' : ''}> Zelf een ander drinkvenster kiezen</label>
      <div id="manualbox" class="${manual ? '' : 'hidden'}"><div class="row"><div class="f"><label>Op dronk vanaf</label><input id="mvan" type="month"></div><div class="f"><label>Piek</label><input id="mpiek" type="month"></div></div><div class="f"><label>Drinken vóór</label><input id="mtot" type="month"></div></div>
      <div class="setsec" id="vlbl">${b.soort === 'bier' ? 'Untappd' : 'Vivino'}</div>
      <div class="row"><div class="f"><label>Score</label><input id="vivinoScore" type="number" inputmode="decimal" step="0.1" min="0" max="5" value="${esc(b.vivinoScore)}" placeholder="bijv. 4,2"></div>
        <div class="f" style="display:flex;align-items:flex-end"><a class="btn ghost block" id="vsearch" target="_blank" rel="noopener">${I.ext} Opzoeken</a></div></div>
      <div class="f"><label>Link naar pagina (optioneel)</label><input id="vivinoUrl" type="url" value="${esc(b.vivinoUrl)}" placeholder="Plak hier de deellink uit de app"><div class="hint">Tip: in de Vivino-app op <em>Delen</em> → <em>Link kopiëren</em> en hier plakken. Dan opent de knop direct de juiste wijn.</div></div>
      <div class="f"><label>Notitie</label><textarea id="notitie" placeholder="Waar gekocht, cadeau van…">${esc(b.notitie)}</textarea></div>
      <div class="btns"><button class="btn gold block" id="save">${ex ? 'Opslaan' : 'In de kast leggen'}</button></div>`;
    openSheet(ex ? 'Bewerken' : 'Nuova bottiglia', html, sh => {
      const v = id2 => $('#' + id2, sh);
      const read = () => {
        const o = { ...b };
        o.soort = $('#soort .on', sh).dataset.v;
        for (const key of ['naam', 'producent', 'categorie', 'jaargang', 'druif', 'stijl', 'bottelDatum', 'land', 'regio', 'aantal', 'plankId', 'prijs', 'alcohol', 'aankoopDatum', 'vivinoScore', 'vivinoUrl', 'notitie']) o[key] = v(key).value.trim();
        o.aantal = Math.max(0, parseInt(o.aantal) || 0);
        o.jaargang = o.jaargang ? parseInt(o.jaargang) : '';
        if (o.vivinoScore) o.vivinoScore = Math.min(5, parseFloat(String(o.vivinoScore).replace(',', '.')) || 0) || '';
        if (o.soort === 'bier') { delete o.categorie; } else if (!o.categorie) o.categorie = 'rood';
        return o;
      };
      const refresh = () => {
        const o = read(), isB = o.soort === 'bier';
        $$('.w-only', sh).forEach(e => e.classList.toggle('hidden', isB));
        $$('.b-only', sh).forEach(e => e.classList.toggle('hidden', !isB));
        v('lprod').textContent = isB ? 'Brouwerij' : 'Producent / domein';
        v('vlbl').textContent = isB ? 'Untappd' : 'Vivino';
        v('vsearch').href = vivinoUrl({ ...o, vivinoUrl: '' });
        const w = L.schatVenster(o);
        v('adv').innerHTML = o.naam ? `<div class="t">Roberto adviseert</div><div class="d">Op dronk <b>${L.fmtYm(w.van)}</b> – <b>${L.fmtYm(w.tot)}</b>, piek rond <b>${L.fmtYm(w.piek)}</b></div><div class="w">${esc(w.uitleg)}</div>` : '<div class="w">Vul naam, jaargang, druif of stijl in voor een drinkadvies.</div>';
        if (!manual) { v('mvan').value = w.van; v('mpiek').value = w.piek; v('mtot').value = w.tot; }
        return { o, w };
      };
      if (manual && b.venster) { v('mvan').value = b.venster.van; v('mpiek').value = b.venster.piek; v('mtot').value = b.venster.tot; }
      $$('#soort button', sh).forEach(x => x.onclick = () => { $$('#soort button', sh).forEach(y => y.classList.toggle('on', y === x)); refresh(); });
      sh.addEventListener('input', e => { if (!['mvan', 'mpiek', 'mtot', 'notitie'].includes(e.target.id)) refresh(); });
      v('manual').onchange = () => { manual = v('manual').checked; v('manualbox').classList.toggle('hidden', !manual); refresh(); };
      refresh();
      v('save').onclick = () => {
        const { o, w } = refresh();
        if (!o.naam) { toast('Vul een naam in'); v('naam').focus(); return; }
        o.venster = manual && v('mvan').value && v('mtot').value
          ? { van: v('mvan').value, piek: v('mpiek').value || v('mvan').value, tot: v('mtot').value, bron: 'handmatig' }
          : { ...w, bron: 'auto' };
        if (ex) { Object.assign(ex, o); touch(ex); }
        else { o.id = uid(); o.createdAt = nowIso(); touch(o); data.bottles.push(o); }
        closeSheet(); changed(); toast(ex ? 'Opgeslagen' : 'In de kast gelegd 🍷');
      };
    });
  }

  /* ---------- proeven ---------- */
  function openTasting(bottleId, gerecht = '', tastingId = null) {
    const ex = tastingId ? data.tastings.find(t => t.id === tastingId) : null;
    const b = bottleId ? getBottle(bottleId) : ex ? getBottle(ex.bottleId) : null;
    const t = ex ? { ...ex } : { datum: todayYmd(), gerecht, cijfer: 0, metWie: '', notitie: '' };
    const namen = [...new Set(data.tastings.filter(x => !x.deleted).flatMap(x => (x.metWie || '').split(/,| en | & /).map(s => s.trim())).filter(Boolean))].slice(0, 12);
    const fles = ex ? ex.fles : { naam: b.naam, producent: b.producent, jaargang: b.soort === 'bier' ? '' : b.jaargang, soort: b.soort, categorie: b.categorie, stijl: b.stijl };
    const html = `<div class="dhead">${flesIcon(b || fles)}<div><h3>${esc(fles.naam)} ${fles.jaargang ? esc(fles.jaargang) : ''}</h3><div class="sub">${esc(fles.producent || '')}</div></div></div>
      <div class="f"><label>Cijfer</label><div class="starsel" id="stars"></div><div class="hint">Tik links op een ster voor een halve punt, net als in Vivino.</div></div>
      <div class="f"><label>Datum</label><input id="datum" type="date" value="${esc(t.datum)}"></div>
      <div class="f"><label>Met wie</label><input id="metWie" value="${esc(t.metWie)}" placeholder="Bijv. Danny en Kim">${namen.length ? `<div class="namechips">${namen.map(n => `<button class="chip" data-n="${esc(n)}">${esc(n)}</button>`).join('')}</div>` : ''}</div>
      <div class="f"><label>Gerecht</label><input id="gerecht" value="${esc(t.gerecht)}" placeholder="Wat aten jullie erbij?"></div>
      <div class="f"><label>Notitie</label><textarea id="notitie" placeholder="Kers, leer, tabak… lange afdronk.">${esc(t.notitie)}</textarea></div>
      ${!ex && b ? `<label class="switch"><input type="checkbox" id="uit" ${b.aantal > 0 ? 'checked' : ''}> Fles uit de kast halen (${+b.aantal || 0} → ${Math.max(0, (+b.aantal || 0) - 1)})</label>` : ''}
      <div class="btns"><button class="btn gold block" id="tsave">${ex ? 'Opslaan' : 'Salute! Opslaan'}</button></div>
      ${ex ? `<div class="btns"><button class="btn danger" id="tdel">${I.trash} Verwijderen</button></div>` : ''}`;
    openSheet(ex ? 'Degustazione' : 'Salute!', html, sh => {
      let val = +t.cijfer || 0;
      const drawStars = () => { $('#stars', sh).innerHTML = [1, 2, 3, 4, 5].map(i => `<button data-i="${i}">${I.star(val >= i ? 1 : val >= i - .5 ? .5 : 0)}</button>`).join('') + `<span class="val">${val ? val.toFixed(1).replace('.', ',') : '–'}</span>`; $$('#stars button', sh).forEach(btn => btn.onclick = e => { const r = btn.getBoundingClientRect(); const half = (e.clientX - r.left) < r.width / 2; const i = +btn.dataset.i; val = half ? i - .5 : i; drawStars(); }); };
      drawStars();
      $$('[data-n]', sh).forEach(c => c.onclick = () => { const inp = $('#metWie', sh); const cur = inp.value.trim(); if (!cur.split(/,| en | & /).map(s => s.trim()).includes(c.dataset.n)) inp.value = cur ? cur + ', ' + c.dataset.n : c.dataset.n; });
      $('#tsave', sh).onclick = () => {
        const o = ex || { id: uid(), createdAt: nowIso(), bottleId: b?.id, fles };
        o.datum = $('#datum', sh).value || todayYmd(); o.metWie = $('#metWie', sh).value.trim(); o.gerecht = $('#gerecht', sh).value.trim(); o.notitie = $('#notitie', sh).value.trim(); o.cijfer = val;
        touch(o); if (!ex) data.tastings.push(o);
        const uit = $('#uit', sh); if (uit && uit.checked && b) { b.aantal = Math.max(0, (+b.aantal || 0) - 1); touch(b); }
        closeAllSheets(); changed(); toast('Salute! Toegevoegd aan het dagboek'); go('diario');
      };
      const del = $('#tdel', sh); if (del) del.onclick = () => { if (confirm('Deze proefnotitie verwijderen?')) { ex.deleted = true; touch(ex); closeSheet(); changed(); } };
    });
  }

  /* ---------- meldingen (web push) ---------- */
  const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromB64url = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  const mySubs = () => data.subscriptions.filter(s => !s.deleted);
  function pushStatusText() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'Deze browser ondersteunt geen meldingen. Installeer Roberto via Chrome op Android.';
    const subs = mySubs();
    const me = subs.filter(s => s.user === cfg.user).length;
    if (!S().push.publicKey) return 'Nog niet ingesteld. Op de 1e van elke maand krijgen jullie een melding met de flessen die op hun best zijn.';
    if (Notification.permission === 'granted' && me) return `Aan voor ${subs.map(s => s.user).filter((x, i, a) => a.indexOf(x) === i).join(' en ')}. Elke 1e van de maand om 9:00 een melding.`;
    return 'Sleutel is ingesteld; zet meldingen aan op deze telefoon.';
  }
  async function genVapid() {
    const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const pub = b64url(await crypto.subtle.exportKey('raw', kp.publicKey));
    const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
    return { publicKey: pub, privateKey: jwk.d };
  }
  async function enablePush() {
    if (!cfg.user) { toast('Kies eerst wie je bent'); return; }
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { toast('Meldingen worden hier niet ondersteund'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { toast('Toestemming geweigerd: zet meldingen aan in de Android-instellingen'); return; }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (sub) { try { await sub.unsubscribe(); } catch { } }
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: fromB64url(S().push.publicKey) });
    const j = sub.toJSON();
    const hash = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(j.endpoint))).slice(0, 16);
    let s = data.subscriptions.find(x => x.id === hash);
    if (!s) { s = { id: hash, createdAt: nowIso() }; data.subscriptions.push(s); }
    Object.assign(s, { user: cfg.user, apparaat: (navigator.userAgentData?.platform || navigator.platform || '') + ' · ' + new Date().toLocaleDateString('nl-NL'), endpoint: j.endpoint, keys: j.keys, deleted: false });
    touch(s); changed(); sync();
    reg.showNotification('Roberto', { body: 'Meldingen staan aan. Op de 1e van de maand hoor je wat er op moet. Salute!', icon: 'icons/icon-192.png', badge: 'icons/badge-96.png' });
    toast('Meldingen aan ✓');
  }

  /* ---------- instellingen ---------- */
  function openSettings(focus) {
    const k = S().kast, g = cfg.gh;
    const html = `<div class="setsec">Wie ben jij?</div>
      <div class="seg" id="who">${S().namen.map(n => `<button data-v="${esc(n)}" class="${cfg.user === n ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>
      <div class="setsec">De kast</div>
      <div class="row"><div class="f"><label>Merk</label><input id="k-merk" value="${esc(k.merk)}"></div><div class="f"><label>Type</label><input id="k-model" value="${esc(k.model)}"></div></div>
      <div class="f"><label>Capaciteit (flessen)</label><input id="k-cap" type="number" value="${esc(k.capaciteit)}"><div class="hint">De Liebherr EWTgb 3583 heeft 2 zones en past 83 Bordeaux-flessen.</div></div>
      ${k.zones.map((z, i) => `<div class="row"><div class="f"><label>Zone ${i + 1}</label><input data-zn="${z.id}" value="${esc(z.naam)}"></div><div class="f"><label>Temperatuur</label><input data-zt="${z.id}" value="${esc(z.temp)}"></div></div>`).join('')}
      <div class="f"><label>Planken</label><div id="planken">${k.planken.map(p => shelfRow(p, k.zones)).join('')}</div>
      <button class="btn ghost" id="addplank" style="margin-top:6px">${I.plus} Plank toevoegen</button></div>
      <div class="btns"><button class="btn" id="savekast">Kast opslaan</button></div>

      <div class="setsec" id="sec-gh">Samen delen via GitHub</div>
      <div class="small">Status: ${GH.on() ? (syncErr ? '⚠️ ' + esc(syncErr) : lastSync ? 'gesynchroniseerd om ' + lastSync.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : 'gekoppeld') : 'niet gekoppeld: alleen op deze telefoon'}</div>
      <div class="row"><div class="f"><label>GitHub-gebruikersnaam</label><input id="g-owner" value="${esc(g.owner)}" autocapitalize="off"></div><div class="f"><label>Data-repo</label><input id="g-repo" value="${esc(g.repo)}" autocapitalize="off"></div></div>
      <div class="f"><label>Token</label><input id="g-token" type="password" value="${esc(g.token)}" placeholder="github_pat_…" autocapitalize="off"><div class="hint">Een fine-grained token met alleen <em>Contents: read &amp; write</em> op de data-repo. Het token blijft op deze telefoon.</div></div>
      <div class="btns"><button class="btn" id="g-save">Koppelen &amp; synchroniseren</button></div>
      ${GH.on() ? `<div class="btns"><button class="btn ghost" id="g-share">Koppeling delen met ${esc(S().namen.find(n => n !== cfg.user) || 'partner')}</button></div><div class="small">Stuurt een link waarmee de andere telefoon direct gekoppeld is. Die link bevat het token, dus stuur hem alleen naar elkaar.</div>` : ''}

      <div class="setsec" id="sec-push">Meldingen</div>
      <div class="small" style="margin-bottom:8px">${esc(pushStatusText())}</div>
      ${S().push.publicKey ? `<div class="btns"><button class="btn gold" id="p-on">${I.bell} Meldingen aanzetten op deze telefoon</button></div>
        <div class="btns"><button class="btn ghost" id="p-test">Voorbeeld van een melding</button></div>
        ${mySubs().length ? `<div class="small" style="margin-top:8px">Aangemelde telefoons: ${mySubs().map(s => esc(s.user + ' (' + (s.apparaat || '') + ')')).join(', ')}</div>` : ''}`
        : `<div class="small">Eenmalig instellen: Roberto maakt een sleutelpaar. De <b>publieke</b> sleutel bewaart de app zelf. De <b>geheime</b> sleutel zet je als secret in GitHub (zie de handleiding).</div><div class="btns"><button class="btn" id="p-gen">Sleutels aanmaken</button></div>`}
      <div id="vapidout"></div>

      <div class="setsec">Back-up</div>
      <div class="btns"><button class="btn ghost" id="exp">Exporteren (JSON)</button><label class="btn ghost">Importeren<input type="file" id="imp" accept="application/json" class="hidden"></label></div>
      <div class="small" style="margin-top:18px;text-align:center">Roberto · cantina di vino &amp; birra<br>${bottlesLive().length} wijnen/bieren · ${data.tastings.filter(t => !t.deleted).length} proefnotities</div>`;
    openSheet('Impostazioni', html, sh => {
      if (focus === 'push') setTimeout(() => $('#sec-push', sh).scrollIntoView({ behavior: 'smooth' }), 300);
      $$('#who button', sh).forEach(x => x.onclick = () => { cfg.user = x.dataset.v; saveCfg(); $$('#who button', sh).forEach(y => y.classList.toggle('on', y === x)); toast('Ciao ' + cfg.user + '!'); renderAll(); });
      const wireShelves = () => $$('[data-delp]', sh).forEach(x => x.onclick = () => x.closest('.shelfrow').remove());
      wireShelves();
      $('#addplank', sh).onclick = () => { const n = $$('.shelfrow', sh).length + 1; $('#planken', sh).insertAdjacentHTML('beforeend', shelfRow({ id: 'p' + uid(), naam: 'Plank ' + n, zone: k.zones[k.zones.length - 1].id }, k.zones)); wireShelves(); };
      $('#savekast', sh).onclick = () => {
        k.merk = $('#k-merk', sh).value.trim(); k.model = $('#k-model', sh).value.trim(); k.capaciteit = parseInt($('#k-cap', sh).value) || 83;
        k.zones.forEach(z => { z.naam = $(`[data-zn="${z.id}"]`, sh).value.trim() || z.naam; z.temp = $(`[data-zt="${z.id}"]`, sh).value.trim(); });
        k.planken = $$('.shelfrow', sh).map(r => ({ id: r.dataset.id, naam: $('input', r).value.trim() || 'Plank', zone: $('select', r).value }));
        S().updatedAt = nowIso(); changed(); toast('Kast opgeslagen');
      };
      $('#g-save', sh).onclick = async () => {
        cfg.gh = { ...cfg.gh, owner: $('#g-owner', sh).value.trim(), repo: $('#g-repo', sh).value.trim(), token: $('#g-token', sh).value.trim() };
        saveCfg(); await sync(true); closeSheet(); openSettings();
      };
      const share = $('#g-share', sh); if (share) share.onclick = async () => {
        const link = location.origin + location.pathname + '#koppel=' + b64enc(JSON.stringify({ o: cfg.gh.owner, r: cfg.gh.repo, t: cfg.gh.token, p: cfg.gh.path, b: cfg.gh.branch }));
        if (navigator.share) { try { await navigator.share({ title: 'Roberto koppelen', text: 'Open deze link op je telefoon om Roberto te koppelen aan onze kelder 🍷', url: link }); } catch { } }
        else { await navigator.clipboard?.writeText(link); toast('Link gekopieerd'); }
      };
      const gen = $('#p-gen', sh); if (gen) gen.onclick = async () => {
        const keys = await genVapid();
        S().push = { publicKey: keys.publicKey }; S().updatedAt = nowIso(); changed();
        $('#vapidout', sh).innerHTML = `<div class="advice"><div class="t">Kopieer deze twee waarden naar GitHub</div>
          <div class="d">In je <b>data-repo</b>: Settings → Secrets and variables → Actions → <em>New repository secret</em>.</div>
          <div class="f"><label>VAPID_PUBLIC_KEY</label><div class="code">${keys.publicKey}</div></div>
          <div class="f"><label>VAPID_PRIVATE_KEY (geheim!)</label><div class="code">${keys.privateKey}</div></div>
          <div class="btns"><button class="btn ghost" id="cpy">Beide kopiëren</button></div>
          <div class="w">De geheime sleutel wordt nergens bewaard. Sluit dit scherm pas als hij in GitHub staat.</div></div>`;
        $('#cpy', sh).onclick = () => navigator.clipboard.writeText(`VAPID_PUBLIC_KEY=${keys.publicKey}\nVAPID_PRIVATE_KEY=${keys.privateKey}`).then(() => toast('Gekopieerd'));
      };
      const on = $('#p-on', sh); if (on) on.onclick = () => enablePush().catch(e => toast('Mislukt: ' + e.message));
      const test = $('#p-test', sh); if (test) test.onclick = async () => {
        if (Notification.permission !== 'granted') { toast('Zet eerst meldingen aan'); return; }
        const reg = await navigator.serviceWorker.ready; const msg = buildMessage(bottlesLive());
        reg.showNotification(msg.title, { body: msg.body, icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', data: { url: './#bere' } });
      };
      $('#exp', sh).onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })); a.download = `roberto-backup-${todayYmd()}.json`; a.click(); };
      $('#imp', sh).onchange = async e => { const f = e.target.files[0]; if (!f) return; try { const j = JSON.parse(await f.text()); if (!Array.isArray(j.bottles)) throw 0; data = merge(data, j); changed(); toast('Geïmporteerd'); } catch { toast('Ongeldig bestand'); } };
    });
  }
  function shelfRow(p, zones) {
    return `<div class="shelfrow" data-id="${esc(p.id)}"><input value="${esc(p.naam)}"><select>${zones.map(z => `<option value="${z.id}" ${p.zone === z.id ? 'selected' : ''}>${esc(z.naam)}</option>`).join('')}</select><button class="iconbtn" data-delp title="Verwijderen">${I.trash}</button></div>`;
  }
  function buildMessage(bottles) {
    const t = L.tijdVoor(bottles.filter(b => b.aantal > 0));
    const all = [...t.laatste, ...t.piek, ...t.over];
    const nm = b => b.naam + (b.soort !== 'bier' && b.jaargang ? ' ' + b.jaargang : '');
    if (!all.length) return { title: 'Roberto · ' + L.meseIt(L.ymNow()), body: 'Niets dat per se op moet deze maand. Rustig laten liggen.' };
    return { title: `Roberto · ${all.length} ${all.length === 1 ? 'fles' : 'flessen'} op hun best`, body: all.slice(0, 4).map(nm).join(', ') + (all.length > 4 ? ` en nog ${all.length - 4}` : '') };
  }

  /* ---------- demo ---------- */
  function loadDemo() {
    const y = new Date().getFullYear(), ym = L.ymNow();
    const mk = (o) => { const b = { id: uid(), createdAt: nowIso(), aantal: 1, aankoopDatum: L.addMonths(ym, -10), ...o }; b.venster = { ...L.schatVenster(b), bron: 'auto' }; touch(b); return b; };
    const demo = [
      mk({ soort: 'wijn', categorie: 'rood', naam: 'Barolo Bussia', producent: 'Prunotto', jaargang: 2016, land: 'Italië', regio: 'Piemonte', druif: 'Nebbiolo', aantal: 3, plankId: 'p2', prijs: 54, vivinoScore: 4.3 }),
      mk({ soort: 'wijn', categorie: 'rood', naam: 'Chianti Classico Riserva', producent: 'Fèlsina', jaargang: y - 7, land: 'Italië', regio: 'Toscane', druif: 'Sangiovese', aantal: 2, plankId: 'p1', prijs: 29, vivinoScore: 4.1 }),
      mk({ soort: 'wijn', categorie: 'rood', naam: 'Amarone della Valpolicella', producent: 'Tommasi', jaargang: 2017, land: 'Italië', regio: 'Veneto', druif: 'Corvina', aantal: 1, plankId: 'p2', prijs: 42, vivinoScore: 4.2 }),
      mk({ soort: 'wijn', categorie: 'rood', naam: 'Château Lynch-Bages', producent: 'Lynch-Bages', jaargang: 2015, land: 'Frankrijk', regio: 'Pauillac', druif: 'Cabernet Sauvignon, Merlot', aantal: 2, plankId: 'p3', prijs: 120, vivinoScore: 4.4 }),
      mk({ soort: 'wijn', categorie: 'rood', naam: 'Morgon Côte du Py', producent: 'Jean Foillard', jaargang: y - 5, land: 'Frankrijk', regio: 'Beaujolais', druif: 'Gamay', aantal: 1, plankId: 'p1', prijs: 32 }),
      mk({ soort: 'wijn', categorie: 'wit', naam: 'Chablis 1er Cru Montée de Tonnerre', producent: 'William Fèvre', jaargang: y - 6, land: 'Frankrijk', regio: 'Bourgogne', druif: 'Chardonnay', aantal: 2, plankId: 'p6', prijs: 45, vivinoScore: 4.1 }),
      mk({ soort: 'wijn', categorie: 'wit', naam: 'Sancerre', producent: 'Pascal Jolivet', jaargang: y - 3, land: 'Frankrijk', regio: 'Loire', druif: 'Sauvignon Blanc', aantal: 2, plankId: 'p7', prijs: 22 }),
      mk({ soort: 'wijn', categorie: 'mousserend', naam: 'Brut Réserve', producent: 'Charles Heidsieck', land: 'Frankrijk', regio: 'Champagne', aantal: 2, plankId: 'p8', prijs: 55, aankoopDatum: L.addMonths(ym, -40), vivinoScore: 4.2 }),
      mk({ soort: 'wijn', categorie: 'dessert', naam: 'Vintage Port', producent: 'Taylor\'s', jaargang: 2011, land: 'Portugal', regio: 'Douro', aantal: 1, plankId: 'p5', prijs: 85 }),
      mk({ soort: 'bier', naam: 'Westvleteren 12', producent: 'Sint-Sixtusabdij', stijl: 'Quadrupel', bottelDatum: L.addMonths(ym, -26), land: 'België', alcohol: 10.2, aantal: 4, plankId: 'p9', vivinoScore: 4.5 }),
      mk({ soort: 'bier', naam: 'Oude Geuze', producent: '3 Fonteinen', stijl: 'Oude geuze', bottelDatum: L.addMonths(ym, -30), land: 'België', alcohol: 6, aantal: 3, plankId: 'p10', vivinoScore: 4.3 }),
      mk({ soort: 'bier', naam: 'Hazy Daze', producent: 'Uiltje', stijl: 'NEIPA / hazy IPA', bottelDatum: L.addMonths(ym, -1), land: 'Nederland', alcohol: 6.5, aantal: 4, plankId: 'p10' }),
      mk({ soort: 'bier', naam: 'Black Damnation', producent: 'De Struise', stijl: 'Barrel aged imperial stout', bottelDatum: L.addMonths(ym, -20), land: 'België', alcohol: 13, aantal: 2, plankId: 'p9' }),
    ];
    data.bottles.push(...demo);
    const t = (b, d, wie, cijfer, gerecht, notitie) => { const o = { id: uid(), createdAt: nowIso(), bottleId: b.id, fles: { naam: b.naam, producent: b.producent, jaargang: b.jaargang || '', soort: b.soort, categorie: b.categorie }, datum: d, metWie: wie, cijfer, gerecht, notitie }; touch(o); return o; };
    data.tastings.push(
      t(demo[0], `${y}-09-14`, 'Danny en Kim', 4.5, 'Ossobuco', 'Rozen, teer en kers. Mooi open na een uur karaf.'),
      t(demo[9], `${y}-10-03`, 'Marion', 5, 'Kaasplank', 'Karamel, gedroogd fruit. Wat een bier.'),
      t(demo[6], `${y}-08-22`, '', 3.5, 'Mosselen', 'Fris en strak, prima maar niet bijzonder.'),
    );
    changed(); toast('Voorbeeldkelder geladen');
  }

  /* ---------- navigatie ---------- */
  const PAGES = ['cantina', 'bere', 'tavola', 'diario'];
  let page = 'cantina';
  function go(p) {
    if (!PAGES.includes(p)) p = 'cantina';
    page = p;
    PAGES.forEach(x => { $('#p-' + x).classList.toggle('active', x === p); $(`nav [data-p="${x}"]`).classList.toggle('on', x === p); });
    $('#fab').classList.toggle('hidden', p !== 'cantina');
    if (location.hash !== '#' + p) history.replaceState(null, '', '#' + p);
    window.scrollTo(0, 0);
  }
  function renderAll() { renderCantina(); renderBere(); renderTavola(); renderDiario(); }

  function handleKoppel() {
    const m = location.hash.match(/^#koppel=(.+)$/); if (!m) return false;
    try {
      const j = JSON.parse(b64dec(decodeURIComponent(m[1])));
      cfg.gh = { owner: j.o, repo: j.r, token: j.t, path: j.p || 'kelder.json', branch: j.b || 'main' }; saveCfg();
      history.replaceState(null, '', location.pathname + '#cantina');
      toast('Gekoppeld aan de kelder ✓');
      return true;
    } catch { toast('Koppellink ongeldig'); return false; }
  }

  function askWho() {
    openSheet('Benvenuti', `<div style="text-align:center;margin:10px 0 6px"><img src="icons/logo.svg" width="96" height="96" alt=""></div>
      <div style="text-align:center;font-family:var(--serif);font-size:20px;font-style:italic;color:var(--bord)">Wie gebruikt deze telefoon?</div>
      <div class="btns">${S().namen.map(n => `<button class="btn gold" data-v="${esc(n)}">${esc(n)}</button>`).join('')}</div>`, sh => {
      $$('[data-v]', sh).forEach(b => b.onclick = () => { cfg.user = b.dataset.v; saveCfg(); closeSheet(); toast('Ciao ' + cfg.user + '! 🍷'); renderAll(); });
    });
  }

  /* ---------- start ---------- */
  function init() {
    $('#settingsbtn').onclick = () => openSettings();
    $('#syncbtn').onclick = () => sync(true);
    $('#fab').onclick = () => openBottleForm();
    $('#sheetbg').onclick = closeSheet;
    $$('nav [data-p]').forEach(b => b.onclick = () => go(b.dataset.p));
    const linked = handleKoppel();
    // migratie van oudere vensters
    let mig = false; for (const b of data.bottles) if (!b.venster && !b.deleted) { b.venster = { ...L.schatVenster(b), bron: 'auto' }; mig = true; }
    if (mig) saveLocal();
    // Preview buiten GitHub Pages: toon voorbeeldkelder
    if (!GH.on() && !data.bottles.length && !/github\.io$/.test(location.hostname) && !/^(localhost|127\.)/.test(location.hostname)) loadDemo();
    renderAll();
    go((location.hash || '#cantina').slice(1));
    setDot(GH.on() ? 'busy' : 'local');
    if (GH.on()) sync(linked);
    if (!cfg.user) askWho();
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { renderAll(); if (GH.on()) sync(); } });
    window.addEventListener('online', () => GH.on() && sync());
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
