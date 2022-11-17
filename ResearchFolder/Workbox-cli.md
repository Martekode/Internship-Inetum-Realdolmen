- [GO BACK TO MAIN](../README.md)
- [Workbox build tools](WorkboxBuildTools.md)

# `workbox-cli`

Lowest barrier to entry option.
### `npm install workbox-cli --save-dev`

to start run the wizard with `npm workbox wizard`. You'll get some questions. Your answers will set up the project. From this interaction you'll get a `workbox-config.js` file. You can customize it. `example`:
```js
    // A config for `generateSW`
    export default {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{css,woff2,png,svg,jpg,js}'
    ],
    swDest: 'dist/sw.js'
    };
```
After the creation of this file you wil be able to either use `generateSW` or `injectManifest` method. More information with Cli's help text. 