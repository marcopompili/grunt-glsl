/*
 * grunt-glsl
 * https://github.com/marcopompili/grunt-glsl
 *
 * Copyright (c) 2018 Marco Pompili
 * Licensed under the MIT license.
 */

var os = require('os')
var directiveTag = "//#gljs"
var inlineCommentPattern = /\/\/.*\n*/
var headerCheck = /\s*\w+:\s*\w+,?/

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str
  }
}

function sanitizedFilename(filepath) {
  return filepath.split(/[\\//]/)
    .reverse()[0]
    .replace(/[^a-z0-9_]/gi, '_')
}

function checkHeader(header) {
  if (!header.startsWith(directiveTag))
    return false

  var header = header.substring(directiveTag.length, header.length)

  if (!headerCheck.test(header))
    return false

  return true
}

function parseHeader(header) {
  var headerArray = header.substring(directiveTag.length, header.length).split(',')
  var gljs = {}

  headerArray.forEach(element => {
    s = element.split(':').map(function(v) { v.trim() })
    gljs[s[0]] = s[1]
  })

  return gljs
}

module.exports = function (grunt) {
  'use strict'
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('glsl', 'Translate shader files to javascript strings.', function () {

    // Output container
    var jsOutput = ''
    
    // Windows flag
    var isWin = /^win/.test(os.platform())

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      lineEndings: isWin ? '\r\n' : '\n',
      trim: false,
      stripComments: false,
      oneString: false
    })

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        var file_exists = grunt.file.exists(filepath)

        if (file_exists)
          grunt.log.ok('Source file ' + filepath + ' found.')
        else
          grunt.log.warn('Source file ' + filepath + ' not found.')

        return file_exists

      }).map(function(filepath) {

        // Read file source.
        var src = grunt.util.normalizelf(grunt.file.read(filepath)).trim()

        if (src) {
          // Split source into array
          var shaderArrSrc = src.split(options.lineEndings)

          // Trim lines
          if (options.trim)
            shaderArrSrc = shaderArrSrc.map(function(line) {
              return line.trim()
            })

          // Strip empty lines
          shaderArrSrc = shaderArrSrc.filter(function(line) { 
            return options.trim ? line : line.trim()
          })

          if (!headerCheck.test(shaderArrSrc[0]))
            grunt.log.error('Source has an invalid header!')

          // Parse directive string into obj
          var gljs = parseHeader(shaderArrSrc[0])
          var shaderName = gljs.varname
          var shaderType = gljs.type

          // Strip directives for grunt-glsl
          shaderArrSrc = shaderArrSrc.filter(function(line) {
            return !line.startsWith(directiveTag)
          })

          // If no shader name is given then sanitize filename
          if (!shaderName) {
            shaderName = sanitizedFilename(filepath)
            grunt.log.ok('Cannot find a valid variable name, using sanitzed filename: ' + shaderName)
          }

          // Remove comments
          if (options.stripComments)
            shaderArrSrc = shaderArrSrc.filter(function(line) {
              return !inlineCommentPattern.test(line)
            })

          // Oneline source
          if (options.oneString) {
            jsOutput += "var " + shaderName + " = '"
            jsOutput += shaderArrSrc.join('\\n')
            jsOutput += "';\n"
          // Arrary of strings (more readable)
          } else {
            jsOutput += "var " + shaderName + " = ["
            jsOutput += shaderArrSrc.map(function(l) {
              return "\n'" + l + "'"
            }).join(',')
            jsOutput += "].join('\\n');\n"
          }
        }
      }).join('\n')

      // Write the destination file.
      grunt.file.write(f.dest, jsOutput)

      // Print a success message.
      grunt.log.writeln('File ' + f.dest + ' created.')
    })
  })
}
