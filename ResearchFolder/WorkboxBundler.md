- [GO BACK TO MAIN](../README.md)
- [workbox build tools](WorkboxBuildTools.md)

# Bundler

The only officially supported bundler by the workbox team is Webpack. You can use different builders too sinds they all have their own workbow plugins. However these are not officially supported by the team.
`workbox-webpack-plugin`is able to run `generateSW` or `injectManifest` methods. But here with the bundler plugin these methods are capitalized. `GenerateSW` and `InjectManifest`. Everything else is similar to `workbox-build`:
```js
// webpack.config.js
import {GenerateSW} from 'workbox-webpack-plugin';

export default {
  // Other webpack config options omitted for brevity...
  plugins: [
    new GenerateSW({
      swDest: './dist/sw.js'
    })
```
there is a lot of similarity with the uncapitalized methods but some things are different. For example the globDirectory doesn't need to be specified sinds webpack already knows the where your production assets are bundled.