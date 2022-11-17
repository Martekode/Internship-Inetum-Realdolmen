- [GO BACK TO MAIN](../README.md)

# Workbox with react
As we already know it already comes included within `create-react-app` but in this section of the doc I will be researching in how it all works with react. 

## options

There are many option to create our service worker. You can use the `workbox-cli`, you can use workbox in the form of a node module or you can use the `workbox-webpack-plugin`.
## workbox weppack plugin
I think we are going to be using the `workbox-webpack-plugin` sinds we are going to be using webpack anyway in the react app. `example-code`:
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
in this example they use `new GenerateSW`. At least at the start we might use `new InjectManifest` sinds I don't know yet if we are going to be precaching. If we precache we use the method from the example, if not we use `new InjectManifest`.