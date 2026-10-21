// 電波がないときも K.Library を開けるように、画面の部品をiPhoneにしまっておく係
// 画面を変更したら、下の数字を1つ増やすと新しい画面に入れかわります
const VERSION = "k-library-v12";

const FILES = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "images/header.jpg",
  "images/apple-touch-icon.png",
  "images/icon-192.png",
  "images/tanuki.png",
  "images/usagi.png",
  "images/risu.png",
  "images/star.png",
  "images/sprout.png",
  "images/tree.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// まずネットから新しいものを取りに行き、つながらないときはしまっておいたものを使う
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // 本の情報や表紙など、よそのサイトのものはしまわない
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
