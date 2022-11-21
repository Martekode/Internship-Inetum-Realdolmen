- [GO BACK TO MAIN](../README.md)

# Angular service worker

### `ng add @angular/pwa`
this will create a service worker with default configurations for caching. This will also create a `manifest file`, this gives instructions how to behave when installed on the device. This will add link in the index.html. This will add the `theme color meta` tag to the index.html. And will generate app icons in the `src/assets` directory.

### prechaching
`@angular/service-worker` and `@angular/pwa` are now installed and should be in the `package.json`. `ng-add` schematic also adds a `ngsw-config.json` file.

### `ng build --prod`

now you'll have a dist folder and inside the `dist/service-worker-web-dev` directory a `ngsw.json` file is located. This folder will tell the SW how to cache the assets. you'll need to add support for caching icon assets by adding it to the to be precached files inside the `ngsw-config.json` file. example:
```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
      "files": [
        "/favicon.ico",
        "/index.html",
        "/*.css",
        "/*.js",
        "/assets/*.png"
        ]
      }
    }
}
```
this was added with the addition of `"/assets/*.png"`.

## `example manifest file`
```json
{
  "name": "manifest-web-dev",
  "short_name": "manifest-web-dev",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

found a new page on some steps for Angular service workers.
## resource 2
- https://blog.angular-university.io/angular-service-worker/

### step ONE:

#### npm install -g @angular/cli@latest
first we need to update the angular-cli to the latest version 

you can also try the upcomming updates to try new features.
#### npm install -g @angular/cli@next 
Now we can start to scaffold the application to a PWA.
#### ng new angular-pwa-app --service-worker
 this is to start a new application 
#### ng add @angular/pwa --project <name of project as in angular.json>
this is to add it to an existing application

### step TWO:
within the package.json you will see that `@angular/service-worker` was added. 

```json
"apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": [
        "styles.css"
      ],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      },
      "serviceWorker": true
    }
  ]
  ```
At the end of this json file, you can also see that the `serviceWorker` flag is set to `true`. This is in the configuration file called `angular.json`.
This flag will add some extra files, that are needed, into the production dist folder. These are some files I've already see mentioned. 
- `ngsw-worker.js`
- `ngsw.json`

#### `ngsw stands for Angular Service Worker`

#### ServiceWorkerModule? What does it do. 
the service worker module was added to our root module.
```js
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
we get a couple of injectable services:
- SwUpdate for managing version updates to the application.
- SwPush for doing server Web Push notification

By loading the ngsw-worker.js, the service worker will be registered in the browser (if supported), via the call `navigator.serviceWorker.register()`
the `register()` method will laod the `ngsw-worker.js` file in a seperate http-request. Now we're missing only one thing to turn our application into a Angular PWA. 

#### the build configuration file `ngsw-config.json`.
This file was also added. This configures the service worker runtime behavior. It maybe possible that the settings are correct for your applcation depending on the project. Other configurations can be added though, if needed. This file contains default caching configurationswhich targets the applications static asset files. 
- index.html
- CSS
- javascript bundles
```json
"buildOptimizer": true,
"serviceWorker": true,
"ngswConfigPath": "src/ngsw-config.json",
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

### step THREE:
#### understanding the angular service worker runtime caching mechanism
All sorts of content can be stored in the browsers cache storage. This a javascript-based key/value caching mechanism that is not reelated to the standard browser `cache-control`. Both can be used sepreatlmy. 
The `assetGroups` section is there to configure exactly what https-requests get cached in `cache storage` by the angular service worker. There are two configurations. 
- entry named : `app`. This is for all single page aplication files.
- - index.html
- - css
- - javasxript bundles
- - favicon
- entry named : `assets`. for any other assets also shipped in the `dist/`folder. `example`: images that are not neccesarily needed to run every page. 
#### caching static files that are the application itself.
the files under the `app` section, are the application itself. the index.html, css, javascript bundles are what every single page needs so they can't be lazy loaded. Want to cache these as early as possible. This is what the `app` caching configuration does. 
these files are going to be downloaded and installed in the background by the service workers. this is what the install mode `prefetch` means.

it is good to download and cache these files as early and permanently as posssible sinds we'll be needing these files for the application all the time.
#### caching other auxiliary static assets. 
the asset files are only cached when requested. This means the install mode is `lazy`. If they are requested ones and there is a new versions they will be downloaded ahead of time. this is update mode `prefetch`.

This is good for assets like images sinds they may not be needed all the time depending on the pages requested by the user.
these are obviously default settings that can be altered to our liking. 
For the `app` files though it is unlikely that we'll use an other method.

with these steps we already have an installable application ready to go.

### step FOUR:
#### understanding and running a PWA production build.
from these steps on it gets a little more practicle. So these instructions will be more like a tryout to get the feel of the PWA working. 
first we'll identify the application by spitting out the version into html. This is so that we easily have a visual on which version is running at the moment. 
This can be as simple as:
```html
<h1>Version V1 is running...</h1>
```
now we create a prod of our app. This is where the service worker will be located. 
##### ng build --prod
this will create the required `dist/` folder. Because off our angular.json file and the serviceWorker flag a couple of files were created in the `dist/` folder. 
#### `ngsw-worker.js` file 
this is *the* Angular service worker istelf. Like all service workers it gets delivered via it's own http request so that the briwser can track if it hs changed and apply the service worker lifecycle. ther ServiceWorkerModule will trigger the loading of this file inderectly by calling `navigation.serviceWorker.register()`. 
The `ngsw-worker.js` will always stay the same sinds it gets loaded in via node_modules. This file will stay the same until you upgrade to a new Angular version that contains a new version of the angular service worker. 
#### `ngsw.json` file 
is the runtime configuration file. The service worker will use this. This file is built based on the `ngsw-config.json` file. The information that the service worker needs is located here about which files to cache and when. 
`example`:
```json
{
  "configVersion": 1,
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "urls": [
        "/favicon.ico",
        "/index.html",
        "/inline.5646543f86fbfdc19b11.bundle.js",
        "/main.3bb4e08c826e33bb0fca.bundle.js",
        "/polyfills.55440df0c9305462dd41.bundle.js",
        "/styles.1862c2c45c11dc3dbcf3.bundle.css"
      ],
      "patterns": []
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "urls": [],
      "patterns": []
    }
  ],
  "dataGroups": [],
  "hashTable": {
    "/inline.5646543f86fbfdc19b11.bundle.js": "1028ce05cb8393bd53706064e3a8dc8f646c8039",
    "/main.3bb4e08c826e33bb0fca.bundle.js": "ae15cc3875440d0185b46b4b73bfa731961872e0",
    "/polyfills.55440df0c9305462dd41.bundle.js": "c3b13e2980f9515f4726fd2621440bd7068baa3b",
    "/styles.1862c2c45c11dc3dbcf3.bundle.css": "3318b88e1200c77a5ff691c03ca5d5682a19b196",
    "/favicon.ico": "84161b857f5c547e3699ddfbffc6d8d737542e01",
    "/index.html": "cfdca0ab1cec8379bbbf8ce4af2eaa295a3f3827"
  }
}
```
#### how does the service worker use `ngsw.json`?
it is either going to load these files via `prefetch` or as needed in case of install mode `lazy`. It will store the file in `cache storage`.
This is all going to happen in the background and when the user next revisited the page or reloads, it is going the serve the cached files. 
It intercepts the http request. 
### step FIVE:
add a webserver. 
#### npm install -g http-server
go to the dist folder and start the http server.
#### cd dist
#### http-server -c-1 .
the `-c-1` option will disable server caching, normally the server will run on the port `8080`.
if you have a REST API running in port 9000 for example, you can proxy ant api calls to it via:
#### http-server -c-1 --proxy hhtp://localhost:9000
 if we go to the server on `http://localhost:8080` and inspect it with the de tools. we can see that we have a service worker running with source file : `ngsw-worker.js`. this is all as expected. 
 #### where are the javascript and css bundles stored? 
 these files can all be found in the cache storage. 
Now that these are stored in the cache storage, if you now reload the page it is going to serve the cached files so it loads faster. The improvement will be a lot better in production instead of localhost.

#### taking the app offline. 
To test if it works we can shut down the server with ctr+c. 
let's now hit refresh after shutting down the server. The application should still be running. 
in the console though we will get the following message: 
#### An unknown error occurred when fetching the script. ngsw-worker.js Failed to load resource: net::ERR_CONNECTION_REFUSED. 
It looks like the only file that tried being fetched was the service worker itself, but apparently that is normal. 
### step SIX:


