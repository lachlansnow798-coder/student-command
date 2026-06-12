const CACHE_NAME = "student-command-v33";
const APP_SHELL = [
  "./",
  "./index.html",
  "./install.html",
  "./styles.css?v=33",
  "./app.js?v=33",
  "./manifest.webmanifest?v=33",
  "./assets/command-sky-bg.png?v=33",
  "./icons/icon.svg?v=33",
  "./icons/icon-192.png?v=33",
  "./icons/icon-512.png?v=33",
  "./icons/apple-touch-icon.png?v=33",
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
