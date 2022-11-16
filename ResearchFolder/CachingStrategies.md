[GO BACK TO MAIN](../README.md)

# caching strategies
`cacheFirst strategy` -> the cache gets priority. this means that the cached data will load first. this is quicker, however the data will be less up to date. so for none critical data this is optimal.
`networkFirst strategy` -> this is for regularly updated requests. It will try to fetch the latest response from the network and if this was successful it will store it in the cache. If the response from the network failes, the already existing cache will be used. 
`StaleWhileRevalidate strategy` -> this will responds the fastest with the cache and if that's not available it will use the network and update the cache. This will revalidate regardless of the caches age. 
`network only strategy` ->  this will send the request, the SW will catch and do the work for the pages request and only use the network to fullfill that request. 
`cache only strategy` -> only uses the cached data to respond to the request. aparenty is used with certain preacaches.

- [3.1 Cache only strat](CacheOnly.md)
- [3.2 Network Only](NetworkOnly.md)
- [3.3 CacheFirstFallbackNetwork](CacheFirstFallback.md)
- [3.4 network first fallback cache](NetworkFirstFallback.md)
- [3.5 stale while revalidate](StaleWhileRevalidate.md)