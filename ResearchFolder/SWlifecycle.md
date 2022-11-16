[GO BACK TO MAIN](../README.md)

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