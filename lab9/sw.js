const CACHE_NAME = "v1.1";
const OFFLINE_URL = "offline.html";

async function cacheOffline() {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(OFFLINE_URL);
}

function deleteOldCache() {
    caches.keys()
        .then(keys => {
            return Promise.all(keys.filter(key => {
                return key !== CACHE_NAME;
            }
            ).map(key => {
                return caches.delete(key);
            }));
        })
};

async function onlineOrOffline(req) {
    try {
        return await fetch(req);

    }
    catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching offline page during install');
            return cache.addAll([OFFLINE_URL]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    console.log('Service Worker activated');
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            onlineOrOffline(event.request));
    }
});