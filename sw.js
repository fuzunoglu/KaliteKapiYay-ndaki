// Service Worker - sadece aynı kaynaktaki dosyaları önbelleğe alır.
const CACHE_NAME = 'kalite-kapi-v42';
const PRECACHE = [
  './',
  './index.html',
  './ic-kapilar.html',
  './celik-kapilar.html',
  './mutfak-dolaplari.html',
  './teslim-ettiklerimiz.html',
  './kataloglar.html',
  './iletisim.html',
  './assets/css/templatemo-hexashop.css',
  './assets/css/ana-sayfa-duzenleme.css?v=42',
  './assets/css/sayfalar.css',
  './assets/css/responsive.css?v=42',
  './assets/css/koleksiyon.css',
  './assets/js/jquery-2.1.0.min.js',
  './assets/js/owl-carousel.js',
  './assets/js/lightbox.js',
  './assets/js/custom.js',
  './assets/js/site-inline.js?v=42',
  './assets/js/koleksiyon.js',
  './assets/js/celik-kapilar.js',
  './assets/koleksiyon/products.js',
  './assets/koleksiyon/surfaces.js',
  './assets/celik-kapilar/products.js',
  './assets/celik-kapilar/gorseller/01.jpg',
  './assets/celik-kapilar/gorseller/02.jpg',
  './assets/celik-kapilar/gorseller/03.jpg',
  './assets/celik-kapilar/gorseller/04.jpg',
  './assets/celik-kapilar/gorseller/05.jpg',
  './assets/celik-kapilar/gorseller/06.jpg',
  './assets/celik-kapilar/gorseller/07.jpg',
  './assets/celik-kapilar/gorseller/08.jpg',
  './assets/celik-kapilar/gorseller/09.jpg',
  './assets/celik-kapilar/gorseller/10.jpg',
  './assets/celik-kapilar/gorseller/11.jpg',
  './assets/celik-kapilar/gorseller/12.jpg',
  './assets/celik-kapilar/gorseller/13.jpg',
  './assets/celik-kapilar/gorseller/14.jpg',
  './assets/celik-kapilar/gorseller/15.jpg',
  './assets/celik-kapilar/gorseller/16.jpg',
  './assets/celik-kapilar/gorseller/17.jpg',
  './assets/celik-kapilar/gorseller/18.jpg',
  './assets/celik-kapilar/gorseller/19.jpg',
  './assets/celik-kapilar/gorseller/20.jpg',
  './assets/celik-kapilar/gorseller/21.jpg',
  './assets/celik-kapilar/gorseller/22.jpg',
  './assets/celik-kapilar/gorseller/23.jpg',
  './assets/celik-kapilar/gorseller/24.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return; // Google Maps, fontlar vb. önbelleğe alınmaz.

  if (request.mode === 'navigate') {
    // Sayfa her zaman ağdan alınır; çevrimdışıyken önbellek kullanılır.
    event.respondWith(
      fetch(request)
        .then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function () { return caches.match(request).then(function (r) { return r || caches.match('./index.html'); }); })
    );
    return;
  }

  // Dosyalar: önbellekten hızlı ver, arka planda güncelle.
  event.respondWith(
    caches.match(request).then(function (cached) {
      const network = fetch(request)
        .then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        })
        .catch(function () { return cached; });
      return cached || network;
    })
  );
});
