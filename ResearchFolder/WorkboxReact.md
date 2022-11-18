- [GO BACK TO MAIN](../README.md)

# Workbox with react
As we already know it already comes included within `create-react-app` but in this section of the doc I will be researching in how it all works with react. 

## options

There are many option to create our service worker. You can use the `workbox-cli`, you can use workbox in the form of a node module or you can use the `workbox-webpack-plugin`.
## workbox weppack plugin
I think we are going to be using the `workbox-webpack-plugin` sinds we are going to be using webpack anyway in the react app. `example-code`:
```js
// webpack.config.js
import {GenerateSW} from 'workbox-webpack-plugin';

export default {
  // Other webpack config options omitted for brevity...
  plugins: [
    new GenerateSW({
      swDest: './dist/sw.js'
    })
```
in this example they use `new GenerateSW`. At least at the start we might use `new InjectManifest` sinds I don't know yet if we are going to be precaching. If we precache we use the method from the example, if not we use `new InjectManifest`.

## alternative 
### ./public/index.html
you can always try to make your service worker from scratch. You do this with the code provided by the docs. In your react app you have  a `public` folder. Inside that folder you have an `index.html` and you can start by writing some code in there. inside a `<script></script>`-tag you can write:
```js
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
this adds an event listener that fires a function when the page loads. `serviceWorker in navigator` checks if the service worker is supported by the browser. If it is supported we start the registering process with `navigator.serviceWorker.register('./sw.js')`. This will register the SW and tell the browser where the code is (`inside ./sw.js`).
### ./sw.js
We plqce this service worker in the root sinds we ant to make the scope the biggest. If we need to make it smaller we still can. The `registration` is done so now follows the `installation` and the `activation`. If we want to precache some stuff this will need to happen in the `installation` step.:
```js
self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v1';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v1'
    // `Cache` instance for later use.
    return cache.addAll([
        // the urls (assets) that need to be precached.
    ]);
  }));
});
```
if we want to fetch some data. (we'll use network fist with fallback on cache):
```js
const cacheName = 'cache-version1';

self.addeventListener('fetch',(event)=>{
    event.respondWith(caches.open(cacheName).then(cache)=> {
        return fetch(event.request.url).then((fetchedResponse)=>{
            cache.put(event.request,fetchedResponse.clone());

            return fetchedResponse;
        }).catch(()=>{
            return cache.match(event.request.url);
        });
    });
})
```
the code will be something like this. I still have to figure it out fully and check out the `event.request` object and see wat's in there. 
`activation step`:
```js
    self.addEventListener('activate', (event) => {
    // Specify allowed cache keys
    const cacheAllowList = ['cache-version2'];

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
Here we are pruning out old cahces if needed. Which is a common task of the activation. 

### Manifest file

inside a `manifest.json` inside the `public` folder.:
```json
{
    "short_name" : "myAppName",
    "name" : "myLongerAppName",
    "icons" : [
        {
            "src" : "/images/logo.png",
            "type" : "image/png",
            "sizes" : "1024x1024"
        }
    ],
    "start_url" : ".",
    "display" : "standalone",
    "theme_color" : "#000000",
    "background_color" : "#ffffff"
}
```
in here you give some settings to the browser about your application for when it's offline. Colors, icons, display settings,... These are all included. We can play with these settings to our own liking.