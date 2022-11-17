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
- - [4.1 the ways of workbox](ResearchFolder/WorkboxWays.md)
- [5. wokrbox build tools](ResearchFolder/WorkboxBuildTools.md)
- - [5.1 Wrokbox-cli](ResearchFolder/Workbox-cli.md)
- - [5.2 Workbox-build](ResearchFolder/Workbox-build.md)
- - [5.3 Bundler](ResearchFolder/WorkboxBundler.md)
- - [5.4 Framework](ResearchFolder/WorkboxFramework.md)
### research
my first day:
As my frst day I was given the info that I am going to make a web app work offline. This is called a PWA or Progressive Web App. This means that a web application ( always needs internet in the traditional sense ) is going to try to fetch data but it has no access to the internet. In the workfield this can happen and the workers still need to be able to see some data. 

### Solving this problem 
I already researched a bit and found that a package named workbox helpes with this. Workbox allows you to create a service worker. This is a piece of code that you can give instructions. These instructions can be many things but the main one is that you can tell the service worker to fetch data as soon as it can (with connection) and to cache it. This will store the latest fetchable data locally so that when the connection shuts off, you still have somewhat up to date data. Normally when you shut off the internet connection you get the dinosaur game in the browser to indicate that you don't have a connection. However this service worker prevents that. It makes it so that your application keeps on working.

### my predictions for this assignement 
I think that fetching the data and caching it is going to be the more easy task. But allowing people to change or modify the data offline and actually changing and modifying it as soon as there is an internet connection, is going to be more difficult. I haven't looked into the last bit yet. 