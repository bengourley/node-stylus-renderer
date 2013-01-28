[![Build Status](https://travis-ci.org/bengourley/node-stylus-renderer.png?branch=master)](https://travis-ci.org/bengourley/node-stylus-renderer)

Render batches of Stylus files with custom settings.

## Install

```
npm install stylus-renderer
```

## Usage

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
render(['index.styl'], { stylusOptions: { compress: 'true' } }, function (err) {
  if (err) throw err
  console.log('done!')
})
```