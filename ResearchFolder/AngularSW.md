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