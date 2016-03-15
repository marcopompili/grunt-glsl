/*
 * grunt-glsl
 * https://github.com/marcs/grunt-glsl
 *
 * Copyright (c) 2015 Marco Pompili
 * Licensed under the MIT license.
 */

var os = require('os');
var cson = require('cson');
var glslOptimizer = require("marcs-glsl-optimizer");

if (typeof String.prototype.startsWith != 'function')
{
  String.prototype.startsWith = function (str)
  {
    return this.slice(0, str.length) == str;
  };
}

module.exports = function(grunt)
{
  "use strict";
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var directiveTag = "//#gljs";

  function stripDirectives(shaderArrSrc)
  {
    var directives = [];
    var j = 0;

    for(var i = 0; i < shaderArrSrc.length; i++)
    {
      if(shaderArrSrc[i].startsWith(directiveTag))
      {
        var directive = shaderArrSrc.splice(i, 1)[0];
        directive = directive.substring(directiveTag.length, directive.length).trim();

        directives[j] = directive;

        j++;
      }
    }

    return directives;
  }

  function stripEmptyLines(shaderArrSrc)
  {
    for(var i = 0; i < shaderArrSrc.length; i++)
      if(!shaderArrSrc[i])
        shaderArrSrc.splice(i, 1);
  }

  function stripComments(shaderArrSrc)
  {
    for(var i = 0; i < shaderArrSrc.length; i++)
      if(shaderArrSrc[i].trim().substring(0, 2) == '//')
        shaderArrSrc.splice(i, 1);
  }

  function optimize(compiler, name, type, source)
  {
    var shader = new glslOptimizer.Shader(compiler, type, source);

    if (!shader.compiled()) {
      throw new Error("Failed to optimize " + name + " shader");
    }

    var output = shader.output();
    shader.dispose();

    return output;
  }

  grunt.registerMultiTask('glsl', 'Translate shader files to javascript strings.', function() {

    var jsOutput = "";

    var isWin = /^win/.test(os.platform());

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      lineEndings: isWin ? "\r\n" : "\n",
      stripComments: false,
      optimize: false,
      target: 'es2',
      oneString: false
    });

    var compiler;

    if(optimize)
    {
      switch (options.target)
      {
        case 'es2':
           compiler = new glslOptimizer.Compiler(glslOptimizer.TARGET_OPENGLES20);
          break;
        case 'es3':
           compiler = new glslOptimizer.Compiler(glslOptimizer.TARGET_OPENGLES30);
          break;
        default:
        break;
      }
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          grunt.log.ok('Source file "' + filepath + '" found.');
          return true;
        }

      }).map(function(filepath) {

        // Read file source.
        var src = grunt.util.normalizelf(grunt.file.read(filepath));
        var shaderArrSrc = src.split(options.lineEndings);
        stripEmptyLines(shaderArrSrc);
        var directives = stripDirectives(shaderArrSrc);

        var gljs = cson.parse(directives.join('\n'));
        var shaderName = gljs.varname;
        var shaderType = gljs.type;
        var i, l;

        // Remove comments
        if(options.stripComments)
          stripComments(shaderArrSrc);

        // Call the glsl-optimizer
        if(options.optimize) {

          var type;

          switch (shaderType) {
            case 'vertex':
              type = glslOptimizer.VERTEX_SHADER;
              break;
            case 'fragment':
              type = glslOptimizer.FRAGMENT_SHADER;
              break;
            default:
              type = false;
              break;
          }

          if(type) {
            src = optimize(compiler, shaderName, type, shaderArrSrc.join('\n'));
            shaderArrSrc = src.split(options.lineEndings);
          }
          else {
            grunt.log.warn('Cannot optimize shader, undefined type.');
          }
        }

        if(options.oneString) {

          jsOutput += 'var ' + shaderName + ' = "';

          for (i = 0, l = shaderArrSrc.length; i < l; i++)
            jsOutput += shaderArrSrc[i] + "\\n";

          jsOutput += '";\n';
        }
        else {

          jsOutput += 'var ' + shaderName + ' = [\n';

          for (i = 0, l = shaderArrSrc.length; i < l; i++)
            jsOutput += "'" + shaderArrSrc[i] + "',\n";

          jsOutput += '].join("\\n");\n';
        }

      }).join('\n');

      // Write the destination file.
      grunt.file.write(f.dest, jsOutput);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });

    // dispose glslOptimizer compiler
    if(compiler)
      compiler.dispose();
  });
};
