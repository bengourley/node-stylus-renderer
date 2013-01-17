module.exports = render

var stylus = require('stylus')
  , nib = require('nib')
  , fs = require('fs')
  , relative = require('path').relative
  , join = require('path').join
  , defaultLogger =
    { debug: console.log
    , info: console.log
    , warn: console.log
    , error: console.log
    }

function render(stylesheets, options, cb) {

  var src = options.src || process.env.PWD
    , dest = options.dest || src
    , stylusOptions = options.stylusOptions || {}
    , logger = options.logger || defaultLogger

  if (!Array.isArray(stylesheets)) stylesheets = [ stylesheets ]

  var count = stylesheets.length
    , errored = false

  logger.debug('Found ' + count + ' stylesheet(s)')

  function complete(err) {
    if (err && err.name === 'ParseError') {
      logger.error(err.message)
    } else if (err) {
      errored = true
      return cb(err)
    }
    if (--count === 0 && !errored) cb()
  }
  stylesheets.forEach(function (file) {
    logger.debug('Compiling ' + file)
    if (file.indexOf('/') === 0) file = relative(src, file)
    compileFile(join(src, file), join(dest, file), stylusOptions, complete)
  })

}

function compile(str, options, path) {
  var c = stylus(str)
    .use(nib())
    .set('filename', path)
  Object.keys(options).forEach(function (key) {
    c.set(key, options[key])
  })
  return c
}

function compileFile(src, dest, options, cb) {
  fs.readFile(src + '.styl', 'utf8', function(err, str) {
    if (err) throw err
    var style = compile(str, options, src)
    style.render(function (err, css) {
      if (err) return cb(err)
      writeFile(dest + '.css', css, function(error) {
        if (error) return cb(error)
        cb(null)
      })
    })
  })
}

function writeFile(file, css, callback) {
  fs.writeFile(file, css, function (err) {
    if (err) return callback(err)
    callback(undefined, file)
  })
}