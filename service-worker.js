const CACHE_NAME = "student-command-v32";
const APP_SHELL = [
  "./",
  "./index.html",
  "./install.html",
  "./styles.css?v=32",
  "./app.js?v=32",
  "./manifest.webmanifest?v=32",
  "./assets/command-sky-bg.png?v=32",
  "./icons/icon.svg?v=32",
  "./icons/icon-192.png?v=32",
  "./icons/icon-512.png?v=32",
  "./icons/apple-touch-icon.png?v=32",
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
