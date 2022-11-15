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
