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

  it('should allow a single `define` node to be passed', function (done) {
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      , define: { 'foo': 'bar' }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(/display: block;/.test(data))
          done()
        })
      })
  })

  it('should allow an array of `define` nodes to be passed', function (done) {
    render(['a.styl'],
      { src: join(__dirname, 'fixtures')
      , define: [ {'bar': 'baz'}, { 'add1': function(a){return parseInt(a,10)+1} } ]
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(/z-index: 1;/.test(data))
          done()
        })
      })
  })

  afterEach(function (done) {
    fs.unlink(join(__dirname, 'fixtures', 'a.css'), done)
  })

})
