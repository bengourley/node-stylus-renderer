```
npm install stylus-renderer
```

```js
var render = require('stylus-renderer')
```

### render(stylesheets, options, cb)

- `stylesheets` an array of stylesheets to render
- `options` is an options hash
  - `src` the source directory, defaults to PWD
  - `dest` the destination directory, defaults to PWD
  - `logger` a custom logger object, defaults to console.log
  - `stylusOptions` hash of options to pass though to stylus
- `cb` is the callback `function (err) {}` (`err` is null if ok)

Eg:
```js
render(['index.styl'], { stylusOptions: { compress: 'true' } }, function () {
  console.log('done!')
})
```