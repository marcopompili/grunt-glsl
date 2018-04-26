var fs = require('fs')
var grunt = require('grunt')

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function getNormalizedFile(filepath) {
  return grunt.util.normalizelf(grunt.file.read(filepath))
}

exports.glsl = {
  setUp: function(done) {
    // setup here if necessary
    done()
  },
  default_options: function(test) {
    test.expect(1)

    const actual = getNormalizedFile('tmp/default_options.js')
    const expected = getNormalizedFile('test/expected/default_options.js')
    test.equal(actual, expected, 'Testing default options.')

    test.done()
  },
  dev_options: function(test) {
    test.expect(1)

    const actual = getNormalizedFile('tmp/dev_options.js')
    const expected = getNormalizedFile('test/expected/dev_options.js')
    test.equal(actual, expected, 'Array made of source lines.')

    test.done()
  },
  dist_options: function(test) {
    test.expect(1)

    const actual = getNormalizedFile('tmp/dist_options.js')
    const expected = getNormalizedFile('test/expected/dist_options.js')
    test.equal(actual, expected, 'String containing the whole source code.')

    test.done()
  },
  empty_file: function(test) {
    test.expect(1)

    test.ok(fs.existsSync('tmp/empty_file.js'), 'Empty file test.')

    test.done()
  }
}
