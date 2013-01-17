var assert = require('assert')
  , join = require('path').join
  , fs = require('fs')
  , render = require('..')
  , noop = function () {}

describe('render()', function () {

  before(function (done) {
    fs.unlink(join(__dirname, 'fixtures', 'a.css'), function () {
      done()
    })
  })

  it('should render a single stylus file', function (done) {
    render(['a'],
      { src: join(__dirname, 'fixtures')
      , stylusOptions:
        { compress: 'true' }
      , logger:
        { debug: noop, info: noop, warn: noop, error: noop }
      }, function (err) {
        assert(!err)
        fs.readFile(join(__dirname, 'fixtures', 'a.css'), function (err, data) {
          assert(!err)
          assert(data.length > 1)
          done()
        })
      })
  })

  after(function (done) {
    fs.unlink(join(__dirname, 'fixtures', 'a.css'), done)
  })

})