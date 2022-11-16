# Internship-Inetum-Realdolmen

## Offline Web app 
- [1. logbook](logBook/README.md)
- [2. Service Workers](ResearchFolder/ServiceWorkers.md)
- - [2.1. SW lifecycle](ResearchFolder/SWlifecycle.md)
- [3. Caching Strategies](ResearchFolder/CachingStrategies.md)
- - [3.1 Cache only strat](ResearchFolder/CacheOnly.md)
- - [3.2 Network Only](ResearchFolder/NetworkOnly.md)
- - [3.3 cashe first, fallback to network](ResearchFolder/CacheFirstFallback.md)

### research
my first day:
As my frst day I was given the info that I am going to make a web app work offline. This is called a PWA or Progressive Web App. This means that a web application ( always needs internet in the traditional sense ) is going to try to fetch data either from an API or a Database but it has no access to the internet. In the workfield this can happen and the workers still need to be able to see some data. 

### Solving this problem 
I already researched a bit and found that a package named workbox helpes with this. Workbox allows you to create a service worker. This is a piece of code that you can give instructions. These instructions can be many things but the main one is that you can tell the service worker to fetch data as soon as it can (with connection) and to cache it. This will store the latest fetchable data locally so that when the connection shuts off, you still have somewhat up to date data. Normally when you shut off the internet connection you get the dinosaur game in the browser to indicate that you don't have a connection. However this service worker prevents that. It makes it so that your application keeps on working.

### my predictions for this assignement 
I think that fetching the data and caching it is going to be the more easy task. But allowing people to change or modify the data offline and actually changing and modifying it as soon as there is an internet connection, is going to be more difficult. I haven't looked into the last bit yet. 






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
# Where does workbox fit in?
So the things that we learned are:
- Network requests
- caching strategies 
- cache management 
- precaching 

workbox is a set of modules thqt simplify SW routing and caching

This is to makes using SW's as easy as possible because without workbow SW's might seem arbitrary and complex. But this doesn't mean that workbox is rigid. It is designed to be flexibel to accomodate complex application requirements.

`workbox-build` has a lot of methods to generate a SW that precaches assets. `generateSW` does the most work out of the box, but `injectManifest` method has more control if needed.

more advanced:
- `workbox-routing` : request matching 
- `workbox-strategies` : caching strategies
- `workbox-precaching` : for precaching assets
- `workbox-expiration` : managing caches
- `workbox-window` : registering a SW and handling updates in de window context

there are more modules to help you with service workers. This is easier to use then to use the SW API directly. 

# The ways of workbox
There is more then one way to use workbox so here will be more info about what to use when and in which situation.

## `generateSW` VS `injectManifest`
these are the 2 core build tools... Which one you use depends on the flexibility needed. `generateSW` is for ease of use and less flexibility. `injectManifest` favors more flexibility, meaning that a lot of code is going to be written by you to specify what it needs to do in detail. 

## when to use `generateSW`
if {
  - you want to precache files associated to your build. files with URL's that are hashes that you might not know.
  - simple caching needs that can be configured with `generqteSW's options`.
}
## when not to use `generateSW`
if {
  - when you want to use other SW features like `Web Push`.
  - when u need more flexibility and need to use more modules or scripts to fine-tune.
}
## when to use `injectManifest`
if {
  - for precaching files but you want to write your own SW
  - complex caching || routing needs that can't be resolved with `generateSW's configuration`
  - when using other API's in your SW.
}
main difference with `generateSW` is that `injectManifest` requires you to specify a source service worker file. the source SW file needs a `self.__WB_MANIFEST` string so that it can be replaced with the precache manifest. 

## when not to use `injectManifest`
if {
  - when you don't want precaching 
  - `generateSW` can do the job you request
  - ease of use is more important then flexibility
}
