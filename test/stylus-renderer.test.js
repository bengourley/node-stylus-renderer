var assert = require('assert')
  , join = require('path').join
  , fs = require('fs')
  , render = require('..')
  , noop = function () {}

describe('render()', function () {

  beforeEach(function (done) {
    fs.unlink(join(__dirname, 'fixtures', 'a.css'), function () {
      done()
    })
  })

  it('should render a single stylus file', function (done) {
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      , stylusOptions:
        { compress: 'true' }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  it('should emit log events', function (done) {
    var logs = 0
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      }, function (err) {
        assert(!err)
        assert(logs)
        done()
      }).on('log', function () { logs++ })
  })

  it('should allow a custom compile function', function (done) {
    var logs = 0
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      , compile: function () { return { render: function (cb) { cb(null, 'CUSTOM!') } } }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  it('should allow configurable stylus options', function (done) {
    var logs = 0
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      , stylusOptions: { linenos: true }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(/\/\* line \d/.test(data))
          done()
        })
      })
  })

  afterEach(function (done) {
    fs.unlink(join(__dirname, 'fixtures', 'a.css'), done)
  })

})