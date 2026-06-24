const CACHE_NAME = "student-command-v38";
const APP_SHELL = [
  "./",
  "./index.html",
  "./install.html",
  "./styles.css?v=38",
  "./app.js?v=38",
  "./manifest.webmanifest?v=38",
  "./assets/command-sky-bg.png?v=38",
  "./icons/icon.svg?v=38",
  "./icons/icon-192.png?v=38",
  "./icons/icon-512.png?v=38",
  "./icons/apple-touch-icon.png?v=38",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
