/* Roberto service worker: offline-cache + pushmeldingen */
const CACHE = 'roberto-v1';
const SHELL = ['./', 'index.html', 'styles.css', 'logic.js', 'app.js', 'manifest.webmanifest',
  'icons/logo.svg', 'icons/wordmark.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/badge-96.png', 'icons/favicon-64.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// App-bestanden: eerst netwerk (altijd de nieuwste versie), anders cache. GitHub-API nooit cachen.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.hostname === 'api.github.com') return;
  if (url.origin !== location.origin && !url.hostname.includes('fonts.')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});

self.addEventListener('push', e => {
  let msg = { title: 'Roberto', body: 'Er ligt iets op je te wachten in de kelder.' };
  try { if (e.data) msg = { ...msg, ...e.data.json() }; } catch { if (e.data) msg.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(msg.title, {
    body: msg.body, icon: 'icons/icon-192.png', badge: 'icons/badge-96.png', tag: msg.tag || 'roberto-maand',
    data: { url: msg.url || './#bere' },
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = new URL(e.notification.data?.url || './#bere', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope)) { c.navigate(target); return c.focus(); }
    return self.clients.openWindow(target);
  }));
});
