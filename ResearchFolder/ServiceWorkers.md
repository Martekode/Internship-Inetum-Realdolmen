[GO BACK TO MAIN](../README.md)


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