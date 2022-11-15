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
- The user visits the page for the first time and therefor has no registered SW. We wait untill the page is fully loaded before registering our SW to prevent bqndwith contention if precaching. 
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

The installation can fail when the promise passed to `event.waitUntill` is rejected. Here the SW get discarded.
---
If the promises get resolved then the installation succeeds and the SW state will be `Installed`.
