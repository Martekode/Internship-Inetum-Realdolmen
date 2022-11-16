- [GO BACK TO MAIN](../README.md)
- [caching strategies](CachingStrategies.md)

### network only 
this is the opposite from cache only. The request passes through the SW to the network without interacting with the cache. You always get the most up to date assets, tradeoff is that this never works when offline. 

using this method means that you don't call event.respondWith. 