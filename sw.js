/* Offline shell. The shell is served network-first so editing phrasebook.js or
   styles.css reaches installed phones on the next opening; only when the network
   is missing does the cached copy get used. Bump CACHE when the file list changes. */
const CACHE = "replypal-v3";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./phrasebook.js",
  "./interview-phrases.js",
  "./matcher.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const SHELL_PATHS = new Set(SHELL.map((s) => new URL(s, self.location.href).pathname));
const isShell = (url) => SHELL_PATHS.has(url.pathname);

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(SHELL.map((url) => c.add(url)))));
  self.skipWaiting();
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  if (isShell(new URL(req.url))) {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  ev.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => caches.match("./index.html"))
    )
  );
});
