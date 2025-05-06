//cache is storage of browser
const CACHE_NAME = "version-1";
//conditon for index or offline
const urlsToCache = [ 'index.html', 'offline.html' ];

//self represents this file service worker
const self = this;

// Install SW {services worker}
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache'); //this will show only once when there is no cache

                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html')) //if there is not internet , then show this page
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName); //deleting all the previos version and keeping only new version
                }
            })
        ))
            
    )
});