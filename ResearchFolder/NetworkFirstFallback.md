- [GO BACK TO MAIN](../README.md)
- [caching strategies](CachingStrategies.md)

### network first falling back to cache 
reverse of cache first falling back to network. go to network first and store it in the cache and if that gives no response or doesn't work you fall back to the cached assets and serve those. 
this is great for `html` and `API` requests when, while online, you want the most recent data and you want to update your cache with that recent data. 

`example with html request`:
```js
    // Establish a cache name
    const cacheName = 'MyFancyCacheName_v1';

    self.addEventListener('fetch', (event) => {
    // Check if this is a navigation request
    if (event.request.mode === 'navigate') {
        // Open the cache
        event.respondWith(caches.open(cacheName).then((cache) => {
        // Go to the network first
        return fetch(event.request.url).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());

            return fetchedResponse;
        }).catch(() => {
            // If the network is unavailable, get
            return cache.match(event.request.url);
        });
        }));
    } else {
        return;
    }
    });
```
`explanation`: -> we check if the request.mode is navigate meaning we want html request. so we open the cache with `caches.open(cacheName)`. After that we do teh fetch because of network first. We get a fetchedResponse back and we `cache.put(event.request, fetchedResponse.clone())` it to store it in the cache. then we return the actual fetchedResponse. If we get an error, we catch it with `.catch()`. And in this `catch` we tell it to find and match the assets that are requested via the `cache.match(event.request.url)`. 

`I beleive that this strategy is the most usefull ones for this task`