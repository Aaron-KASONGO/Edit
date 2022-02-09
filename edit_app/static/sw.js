/*const { Client } = require("socket.io/dist/client");

const cacheName = 'Temporas';

// Cache all the files to make a PWA
self.addEventListener('install', e => {
  e.waitUntil(
    (async () =>{
    const cache= await caches.open(cacheName);
    cache.add("/offline.html")
      // Our application only has two files here index.html and manifest.json
      // but you can add more such as style.css as your app grows
    })
  );
});
self.addEventListener('activate', ()=>{
  Client.claim();
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});*/
const PREFIX = 'V1';
self.addEventListener('install', ()=>{
  console.log(`${PREFIX} Install`)
})
self.addEventListener('activate', ()=>{
  console.log(`${PREFIX} Active`)
})

self.addEventListener('fetch',(event)=>{
  console.log(`Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
if(event.request.mode === "navigate"){
  event.respondWith(
    (async ()=>{
      try{
        const preloadResponse = await event.preloadResponse;
        if(preloadResponse){
          return preloadResponse;
        }

        return await fetch(event.request);

      //const networkResponse = await fetch(event.request);
      } catch(e) {
      return new Response("Bonjour les gens");
      }
    })()
  );
}
});