- [GO BACK TO MAIN](../README.md)
- [Cache Strategies](CacheStrategies.md)

## cashe first, fallback to network
- the request hits the cache. if it's in the cache serve it from there. 
- if the request is not in cache, go to network 
- once the network request finishes put it in the cache and then return the response from the network.

`example`:
```js
    // Establish a cache name
    const cacheName = 'MyFancyCacheName_v1';

    self.addEventListener('fetch', (event) => {
    // Check if this is a request for an image
    if (event.request.destination === 'image') {
        event.respondWith(caches.open(cacheName).then((cache) => {
        // Go to the cache first
        return cache.match(event.request.url).then((cachedResponse) => {
            // Return a cached response if we have one
            if (cachedResponse) {
            return cachedResponse;
            }

            // Otherwise, hit the network
            return fetch(event.request).then((fetchedResponse) => {
            // Add the network response to the cache for later visits
            cache.put(event.request, fetchedResponse.clone());

            // Return the network response
            return fetchedResponse;
            });
        });
        }));
    } else {
        return;
    }
    });
```
`explanation`: if cachedResponse then we use the cach,  but if not then we do a fetch to the event.request. We cache the fetchedResponse with cache.put(event.request, fetchedResponse.clone()) and after that we return the fetchedResponse to the user. 
`usage`-> this example uses images but this is a good strategy for all static assets. it is a performance boost, especially to hashed ones. (css,javascript, images, fonts, ... )