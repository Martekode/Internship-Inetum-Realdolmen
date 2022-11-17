- [GO BACK TO MAIN](../README.md)
- [workbox build tools](WorkboxBuildTools.md)

# `workbox-build`
The `workbox-cli` that we explained earlier is actually a wrapper around the `workbox-build` module. This means that you can use the workbox-build module directly without using the cli. Here you wont use the `workbox-config.js` file, instead you'll be using the `generateSW` or `injectManifest` methods directly in a Node script. `example`:
```js
// build-sw.mjs
import {generateSW} from 'workbox-build';

generateSW({
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{css,woff2,png,svg,jpg,js}'
  ],
  swDest: 'dist/sw.js'
});
```
`explenation`: the generated SW will be written to the `dist` directory when `node build-sw.mjs` command is run.