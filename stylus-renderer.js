module.exports = render

var stylus = require('stylus')
  , fs = require('fs')
  , relative = require('path').relative
  , join = require('path').join
  , Emitter = require('events').EventEmitter


function render(stylesheets, options, cb) {

  if (!Array.isArray(stylesheets)) stylesheets = [ stylesheets ]

  var src = options.src || process.env.PWD
    , dest = options.dest || src
    , use = options.use || null
    , emitter = new Emitter()
    , errored = false
    , count = stylesheets.length
    , compile

  if (typeof options.compile === 'function') {
    compile = options.compile
  } else {
    compile = defaultCompile(options.stylusOptions, use)
  }

  emitter.emit('log', 'Found ' + count + ' stylesheet(s)', 'debug')

  function complete(err) {
    if (err) {
      errored = true
      return cb(err)
    }
    if (--count === 0 && !errored) cb()
  }

  process.nextTick(function () {
    stylesheets.forEach(function (file) {
      emitter.emit('log', 'Compiling ' + file, 'debug')
      if (file.indexOf('/') === 0) file = relative(src, file)
      compileFile(join(src, file), join(dest, file), compile, complete)
    })
  })

  return emitter

}

/*
 * Create a default compile function
 * with just an options hash for
 * convenience.
 */
function defaultCompile(options, use) {
  return function (str, src) {

    var c = stylus(str)
      // Set the filename for better debugging
      .set('filename', src)

    // Use Custom plugin if supplied
    if (use) c.use(use)

    // If any options exist, set them
    if (options) {
      Object.keys(options).forEach(function (key) {
        c.set(key, options[key])
      })
    }

    return c

  }
}

function compileFile(src, dest, compile, cb) {
  fs.readFile(src, 'utf8', function(err, str) {
    if (err) throw err
    var style = compile(str, src)
    style.render(function (err, css) {
      if (err) return cb(err)
      writeFile(dest.replace(/\.\w+$/, '.css'), css, function(error) {
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
