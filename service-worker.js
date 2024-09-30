const CACHE_NAME = "dino-game-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache geöffnet");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Gibt den Cache zurück, wenn vorhanden, andernfalls die Netzwerkanfrage
      return response || fetch(event.request);
    })
  );
});
