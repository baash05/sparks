//when you change these, also change the database.js
var cacheName = 'Notes'; //changing this version will invalidate the cached app shell
var version = "v3"
var filesToCache = ['/fav.ico', '/index.html', '/style.css', '/myscript.js', 'images/icons/icon-192x192.png'];

if( 'function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

  if (workbox) {
    console.log("[ServiceWorker] Precaching app shell 🎉");
    workbox.core.setCacheNameDetails({
      prefix: cacheName,
      suffix: version,
      precache: "pre-cache",
      runtime: "runtime-cache"
    });
    workbox.precaching.precacheAndRoute(filesToCache);
  } else {
    console.log("Boo! Workbox didn't load 😬");
  }

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg)$/,
    workbox.strategies.cacheFirst({
      cacheName: cacheName + '-images-cache-' + version,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 Days
        })
      ]
    })
  );




  workbox.routing.setDefaultHandler(
    workbox.strategies.staleWhileRevalidate({
        cacheName: cacheName + '-default-cache-' + version,
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 50,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 Days
          })
        ]
      })
    );

    workbox.routing.setCatchHandler(({url, event, params}) => {
      console.log('ROUTING Found Error')
    });
}
