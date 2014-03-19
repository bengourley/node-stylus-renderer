[![Build Status](https://travis-ci.org/bengourley/node-stylus-renderer.png?branch=master)](https://travis-ci.org/bengourley/node-stylus-renderer)

Render batches of Stylus files. This module expects stylus to be available via
`require('stylus')` where it is run. This is so that you can use whatever version
of stylus you want to.

It provides a default compile function which cab be customised by passing in 
`stylus` options. Otherwise, a completely custom compile function can be passed in.

To use [Nib](https://github.com/visionmedia/nib) or [Autoprefixer Stylus](https://github.com/jenius/autoprefixer-stylus), pass a custom `use` function.

The render function returns an event emitter so you can listen for log events.

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
  - `use` an optional plugin, such as Nib. Also accepts an array of plugins
  - `stylusOptions` hash of options to pass though to stylus
  - `compile` a custom compile function. If `compile` is set, `stylusOptions` will have no effect.
- `cb` is the callback `function (err) {}` (`err` is null if ok)

Eg:
```js
render(['index.styl'], { use: nib(), stylusOptions: { compress: 'true' } }, function (err) {
  if (err) throw err
  console.log('done!')
}).on('log', function (msg, level) {
  console.log(level + ': ' + msg)
})
```
