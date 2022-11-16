- [GO BACK TO MAIN](../README.md)
- [Where does Workbox fit in?](Wokbox.md)

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