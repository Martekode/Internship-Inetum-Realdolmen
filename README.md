# Internship-Inetum-Realdolmen

## Offline Web app 
- [1. logbook](logBook/README.md)
- [2. Service Workers](ResearchFolder/ServiceWorkers.md)
- - [2.1. SW lifecycle](ResearchFolder/SWlifecycle.md)
- [3. Caching Strategies](ResearchFolder/CachingStrategies.md)
- - [3.1 Cache only strat](ResearchFolder/CacheOnly.md)
- - [3.2 Network Only](ResearchFolder/NetworkOnly.md)
- - [3.3 cashe first, fallback to network](ResearchFolder/CacheFirstFallback.md)
- - [3.4 Network first, fallback to cache](ResearchFolder/NetworkFirstFallback.md)
- - [3.5 stale while revalidate](ResearchFolder/StaleWhileRevalidate.md)
- [4. Where does Workbox fit in?](ResearchFolder/Workbox.md)

### research
my first day:
As my frst day I was given the info that I am going to make a web app work offline. This is called a PWA or Progressive Web App. This means that a web application ( always needs internet in the traditional sense ) is going to try to fetch data either from an API or a Database but it has no access to the internet. In the workfield this can happen and the workers still need to be able to see some data. 

### Solving this problem 
I already researched a bit and found that a package named workbox helpes with this. Workbox allows you to create a service worker. This is a piece of code that you can give instructions. These instructions can be many things but the main one is that you can tell the service worker to fetch data as soon as it can (with connection) and to cache it. This will store the latest fetchable data locally so that when the connection shuts off, you still have somewhat up to date data. Normally when you shut off the internet connection you get the dinosaur game in the browser to indicate that you don't have a connection. However this service worker prevents that. It makes it so that your application keeps on working.

### my predictions for this assignement 
I think that fetching the data and caching it is going to be the more easy task. But allowing people to change or modify the data offline and actually changing and modifying it as soon as there is an internet connection, is going to be more difficult. I haven't looked into the last bit yet. 








 

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
