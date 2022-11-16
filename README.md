# Internship-Inetum-Realdolmen

## Offline Web app 
- [1. logbook](logBook/README.md)
- [2. Service Workers](ResearchFolder/ServiceWorkers.md)
- - [3. SW lifecycle](ResearchFolder/SWlifecycle.md)

### research
my first day:
As my frst day I was given the info that I am going to make a web app work offline. This is called a PWA or Progressive Web App. This means that a web application ( always needs internet in the traditional sense ) is going to try to fetch data either from an API or a Database but it has no access to the internet. In the workfield this can happen and the workers still need to be able to see some data. 

### Solving this problem 
I already researched a bit and found that a package named workbox helpes with this. Workbox allows you to create a service worker. This is a piece of code that you can give instructions. These instructions can be many things but the main one is that you can tell the service worker to fetch data as soon as it can (with connection) and to cache it. This will store the latest fetchable data locally so that when the connection shuts off, you still have somewhat up to date data. Normally when you shut off the internet connection you get the dinosaur game in the browser to indicate that you don't have a connection. However this service worker prevents that. It makes it so that your application keeps on working.

### my predictions for this assignement 
I think that fetching the data and caching it is going to be the more easy task. But allowing people to change or modify the data offline and actually changing and modifying it as soon as there is an internet connection, is going to be more difficult. I haven't looked into the last bit yet. 

# caching strategies
`cacheFirst strategy` -> the cache gets priority. this means that the cached data will load first. this is quicker, however the data will be less up to date. so for none critical data this is optimal.
`networkFirst strategy` -> this is for regularly updated requests. It will try to fetch the latest response from the network and if this was successful it will store it in the cache. If the response from the network failes, the already existing cache will be used. 
`StaleWhileRevalidate strategy` -> this will responds the fastest with the cache and if that's not available it will use the network and update the cache. This will revalidate regardless of the caches age. 
`network only strategy` ->  this will send the request, the SW will catch and do the work for the pages request and only use the network to fullfill that request. 
`cache only strategy` -> only uses the cached data to respond to the request. aparenty is used with certain preacaches.

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

### network only 
this is the opposite from cache only. The request passes through the SW to the network without interacting with the cache. You always get the most up to date assets, tradeoff is that this never works when offline. 

using this method means that you don't call event.respondWith. 
### cashe first, fallback to network
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
