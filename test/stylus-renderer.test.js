var assert = require('assert')
  , join = require('path').join
  , fs = require('fs')
  , render = require('..')
  , rimraf = require('rimraf')
  , async = require('async')

describe('render()', function () {

  beforeEach(function (done) {
    async.waterfall(
      [ function (cb) {
          fs.exists(join(__dirname, 'output'), function (exists) {
            cb(null, exists)
          })
        }
      , function (exists, cb) {
          if (!exists) return cb(null)

          rimraf(join(__dirname, 'output'), cb)
        }
      ]
      , function() {
        fs.mkdir(join(__dirname, 'output'), done)
      }
    )
  })

  it('should render a single stylus file', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , stylusOptions: { compress: 'true' }
      } , function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  it('should emit log events', function (done) {
    var logs = 0
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      }, function (err) {
        assert(!err)
        assert(logs)
        done()
      }).on('log', function () { logs++ })
  })

  it('should allow a custom compile function', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , compile: function () { return { render: function (cb) { cb(null, 'CUSTOM!') } } }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  it('should allow configurable stylus options', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , stylusOptions: { linenos: true }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(/\/\* line \d/.test(data))
          done()
        })
      })
  })

  it('should allow a single `define` node to be passed', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , define: { 'foo': 'bar' }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(/display: block;/.test(data))
          done()
        })
      })
  })

  it('should allow an array of `define` nodes to be passed', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , define: [ { 'bar': 'baz' }, { 'add1': function(a) {return parseInt(a, 10) + 1} } ]
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(/z-index: 1;/.test(data))
          done()
        })
      })
  })

  it('should render a single stylus file and external sourcemap', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , stylusOptions:
        { compress: 'true'
        , sourcemap: { comment: true }
        }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css.map'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  it('should render a single stylus with inline sourcemap', function (done) {
    render([ 'a.styl' ],
      { src: join(__dirname, 'fixtures')
      , dest: join(__dirname, 'output')
      , stylusOptions:
        { compress: 'true'
        , sourcemap: { inline: true }
        }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'output', 'a.css'), function (err, data) {
          assert(!err)
          assert(/sourceMappingURL/.test(data))
          // Check no external sourcemap file was generated
          fs.exists(join(__dirname, 'output', 'a.css.map'), function(exists) {
            assert(!exists)
            done()
          })
        })
      })
  })

  afterEach(function (done) {
    rimraf(join(__dirname, 'output'), done)
  })

})
