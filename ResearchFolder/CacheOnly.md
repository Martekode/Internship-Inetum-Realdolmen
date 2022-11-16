- [GO BACK TO MAIN](../README.md)
- [Caching strategies](CachingStrategies.md)

### cache only strategy 
any needed assets will need to be precached in order to be available for the pattern to work. these assets will never be updated until the SW gets updated.
```js
    // Establish a cache name
    const cacheName = 'MyFancyCacheName_v1';

    // Assets to precache
    const precachedAssets = [
    '/possum1.jpg',
    '/possum2.jpg',
    '/possum3.jpg',
    '/possum4.jpg'
    ];

    self.addEventListener('install', (event) => {
    // Precache assets on install
    event.waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(precachedAssets);
    }));
    });

    self.addEventListener('fetch', (event) => {
    // Is this one of our precached assets?
    const url = new URL(event.request.url);
    const isPrecachedRequest = precachedAssets.includes(url.pathname);

    if (isPrecachedRequest) {
        // Grab the precached asset from the cache
        event.respondWith(caches.open(cacheName).then((cache) => {
        return cache.match(event.request.url);
        }));
    } else {
        // Go to the network
        return;
    }
    });
```
an array of jpg's get precached at installation of the SW. Then we check if the URl from the fetch is in the array of precached items. if so, the SW will respond with the cached assets. if it is not, then it'll use the network. even though we have got no logic for this within this code. 