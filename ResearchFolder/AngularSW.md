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


