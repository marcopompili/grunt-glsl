/*
 * grunt-glsl
 * https://github.com/marcopompili/grunt-glsl
 *
 * Copyright (c) 2018 Marco Pompili
 * Licensed under the MIT license.
 */

const os = require('os')
const directiveTag = "//#gljs"
const inlineCommentPattern = /\/\/.*\n*/

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

function parseDirectives(directiveHeader) {
  const directiveArray = directiveHeader.substring(directiveTag.length, directiveHeader.length).split(',')
  var gljs = {}

  directiveArray.forEach(element => {
    s = element.split(':').map(v => v.trim())
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
    const isWin = /^win/.test(os.platform())

    // Merge task-specific and/or target-specific options with these defaults.
    const options = this.options({
      lineEndings: isWin ? '\r\n' : '\n',
      trim: false,
      stripComments: false,
      oneString: false
    })

    // Iterate over all specified file groups.
    this.files.forEach(f => {

      // Concat specified files.
      var src = f.src.filter(filepath => {

        // Warn on and remove invalid source files (if nonull was set).
        const file_exists = grunt.file.exists(filepath)

        if (file_exists)
          grunt.log.ok(`Source file ${filepath} found.`)
        else
          grunt.log.warn(`Source file ${filepath} not found.`)

        return file_exists

      }).map(filepath => {

        // Read file source.
        const src = grunt.util.normalizelf(grunt.file.read(filepath))

        // Split source into array
        var shaderArrSrc = src.split(options.lineEndings)

        // Trim lines
        if (options.trim)
          shaderArrSrc = shaderArrSrc.map(line => line.trim())

        // Strip empty lines
        shaderArrSrc = shaderArrSrc.filter(line => line)

        // Parse directive string into obj
        const gljs = parseDirectives(shaderArrSrc[0])
        const shaderName = gljs.varname
        const shaderType = gljs.type

        // Strip directives for grunt-glsl
        shaderArrSrc = shaderArrSrc.filter(line => !line.startsWith(directiveTag))

        // If no shader name is given then sanitize filename
        if (!shaderName) {
          shaderName = sanitizedFilename(filepath)
          grunt.log.ok(`Cannot find a valid variable name, using sanitzed filename: ${shaderName}`)
        }

        // Remove comments
        if (options.stripComments)
          shaderArrSrc = shaderArrSrc.filter(line => !inlineCommentPattern.test(line))

        // Oneline source
        if (options.oneString) {
          jsOutput += `const ${shaderName} = '`
          jsOutput += shaderArrSrc.join('\\n')
          jsOutput += "';\n"
        // Arrary of strings (more readable)
        } else {
          jsOutput += `const ${shaderName} = [`
          jsOutput += shaderArrSrc.map(l => `\n'${l}'`).join(',')
          jsOutput += "].join('\\n');\n"
        }
      }).join('\n')

      // Write the destination file.
      grunt.file.write(f.dest, jsOutput)

      // Print a success message.
      grunt.log.writeln(`File ${f.dest} created.`)
    })
  })
}
