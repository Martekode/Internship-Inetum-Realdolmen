- [GO BACK TO MAIN](../README.md)

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

- [the ways of workbox](WorkboxWays.md)