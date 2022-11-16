- [GO BACK TO MAIN](../README.md)
- [caching strategies](CachingStrategies.md)

### stale-while-revalidate
this is according to the docs the most complex one. But this prioritizes speed more while also trying to keep it up to date in the background.
-` first request for a asset`: fetch it from network, place clone in cahce and serve network response.
- `subsequent requests`: serve asset from cache first and in the background fetch from network to update. 
- `requests after`: you'll get latest version from network that was placed in cache in previous step.

this is for data that are sort of important to update but is not crucial. 
`example`:
```js
    // Establish a cache name
    const cacheName = 'MyFancyCacheName_v1';

    self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'image') {
        event.respondWith(caches.open(cacheName).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
            const fetchedResponse = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());

            return networkResponse;
            });

            return cachedResponse || fetchedResponse;
        });
        }));
    } else {
        return;
    }
    });
```