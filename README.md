# Internship-Inetum-Realdolmen

## Offline Web app 

### research
my first day:
As my frst day I was given the info that I am going to make a web app work offline. This is called a PWA or Progressive Web App. This means that a web application ( always needs internet in the traditional sense ) is going to try to fetch data either from an API or a Database but it has no access to the internet. In the workfield this can happen and the workers still need to be able to see some data. 

### Solving this problem 
I already researched a bit and found that a package named workbox helpes with this. Workbox allows you to create a service worker. This is a piece of code that you can give instructions. These instructions can be many things but the main one is that you can tell the service worker to fetch data as soon as it can (with connection) and to cache it. This will store the latest fetchable data locally so that when the connection shuts off, you still have somewhat up to date data. Normally when you shut off the internet connection you get the dinosaur game in the browser to indicate that you don't have a connection. However this service worker prevents that. It makes it so that your application keeps on working.

### my predictions for this assignement 
I think that fetching the data and caching it is going to be the more easy task. But allowing people to change or modify the data offline and actually changing and modifying it as soon as there is an internet connection, is going to be more difficult. I haven't looked into the last bit yet. 

## SERVICE WORKERS
2 forms of caching:
- precaching
- runtime caching

1. Precaching:
this is the process of caching assets ahead of time, typically during a service worker's installation.
2. runtime caching:
is a caching strategy that applies to assets as they are requested from the network during the runtime of the app.
guarantees offline access to the pages and assets the user already has visited.

the service worker is seperated from the main thread. Meaning that their tasks don't compete for attention. 

## 2 important terms of the lifecycle of the SW
### Control
A page being controlled by a service worker means that the network requests are being intercepted by the service worker on behalf of the page.
### Scope
if the location of the page is /directory/index.html and the service workers location is /directory/sw.js then the scope is /directory/. **The scope limits** the pages the service worker is able to **controll**. Though the scope is configurable via response header or passing a scope option to the register method. 

*unless it is specifically needed to limit the scope of the SW (Service Worker), place it in the root so that the scope is as broad as possible.* The documentation tells us no to worry about the response header because it is easier to put the scope of the SW in the root. (efficiency can be talked about if you study it deeper)

## LIFECYCLE SW
### Registration 
first step
```js
  // Don't register the service worker
  // until the page has fully loaded
  window.addEventListener('load', () => {
    // Is service worker available?
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service worker registered!');
      }).catch((error) => {
        console.warn('Error registering service worker:');
        console.warn(error);
      });
    }
  });
```
this code runs on the main thread,
but what does this do?:
- The user visits the page for the first time and therefor has no registered SW. We wait untill the page is fully loaded before registering our SW to prevent bandwith contention if precaching. 
- we also do a quick check to avoid errors in browsers where it isn't supported. 
- if page is fully loaded and if supported then registe /sw.js

**When registering the state is set to "installing"**

### installation
After the registration it fires the install event. This is called only ones per SW until it's updated. We use the addeventlistener to register the install event.

**example**
```js
// /sw.js
self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v1';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v1'
    // `Cache` instance for later use.
    return cache.addAll([
      '/css/global.bc7b80b7.css',
      '/css/home.fe5d0b23.css',
      '/js/home.d3cc4ba4.js',
      '/js/jquery.43ca4933.js'
    ]);
  }));
});
```

**explanation**:    We create a new cache instance and precache assets. `event.waitUntil()` : this accepts a promise and waits for its completion. It does 2 things:
1. creates new cache = myFancyCacheName_v1
2. After this it precaches an array of asset URL's using the async `addAll method`

- The installation can fail when the promise passed to `event.waitUntill` is rejected. Here the SW get discarded.
- If the promises get resolved then the installation succeeds and the SW state will be `Installed`.

### Activation 
if the previous steps are successful then the SW will activate and the state will change to `activating`. The SW has a `activate` event which you can give tasks. A typical task is pruning out old caches. 

for new SW's the activate event fires right after the installation was successful. After `activation` is done the state of the SW becomes `activated`. will only start controlling the page after page reload or navigation.


## Handling updates of the SW
when the first SW is deployed it will need to be updated. 

### Browsers will check for SW updates when:
- when the user navigates to a page that lies in the scope of the SW
- `navigator.serviceWorker.register()` is called with other SW URL. Don't change SW url though.
- `navigator.serviceWorker.register()` is called with the sane SW URL but different scope. can be prevented by keeping the scope of SW within the root of the project.
- when push or sync has been triggered within the last 24 hours.

### How does This happen 
if the scope and URL stayes the same then the SW only updates when its contents has changed. They detect changes in different ways.:
- any changes to scripts requested by importScripts
- any top level code in the SW which affects the fingerprints that the browser generated

browser automatically checks for changes when navigating to a new page within SW scope.

### Manually triggering update checks
`Registration update`:
Registration logic shouldn't change with updates.(generally)But if we talk about SPA's the automatical update check on navigation requests is rare because of the rarity of the navigation requests within SPA's. So you can trigger a manual update check to solve this.:
```js
    navigator.serviceWorker.ready.then((registration) => {
        registration.update();
    });
```
this is not necessary for traditional websites because sessions aren't long lived.

### installation updates
```js
self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v2';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v2'
    // `Cache` instance for later use.
    return cache.addAll([
      '/css/global.ced4aef2.css',
      '/css/home.cbe409ad.css',
      '/js/home.109defa4.js',
      '/js/jquery.38caf32d.js'
    ]);
  }));
});
```
some things are different from the first SW installation. 
- the name of cahceKey = `myFancyCacheName_v2`
- the names of the asset Url's

When a new SW get created that means it is alongside the older SW. The new SW wil enter a waiting state until it gets activated. the waiting state persist until all the clients of the previous SW are closed, after that it will activate.

### Activation update
After the waiting state it start the activation of the new SW and the old SW is discarded. Common task in the updated SW's `activate` event is to prune old caches. Remove old cache instances by getting keys with `caches.keys` and deleting caches that aren't in a defined allow list. `cashes.delete`
`example`:
```js
    self.addEventListener('activate', (event) => {
    // Specify allowed cache keys
    const cacheAllowList = ['MyFancyCacheName_v2'];

    // Get all the currently active `Cache` instances.
    event.waitUntil(caches.keys().then((keys) => {
        // Delete all caches that aren't in the allow list:
        return Promise.all(keys.map((key) => {
        if (!cacheAllowList.includes(key)) {
            return caches.delete(key);
        }
        }));
    }));
    });
```
so What happens?
- old cashes don't automatically close themselves, we have to do that otherwise we risk storage problems. So we create a `cacheAllowList` with inside the name of the new SW. Takes makes the new one allowed to exist. If we then check for the cache instances and keys with `caches.keys`. Every key that is not included within the `cacheAllowList` gets deleted with `caches.delete(key)`.
- After the old cache instances are deleted, the new SW's activate event will finish and will take controll of the page, replacing the old one. 

## and the SW lifecycle goes on

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