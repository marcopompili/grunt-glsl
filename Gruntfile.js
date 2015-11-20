/*
 * grunt-glsl
 * https://github.com/marcs/grunt-glsl
 *
 * Copyright (c) 2015 Marco Pompili
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    glsl: {
      default_options: {
        options: { },
        files: {
          'tmp/default_options.js': ['test/fixtures/vx.glsl', 'test/fixtures/fx.glsl']
        }
      },
      dev_options: {
        options: {
          stripComments: true
        },
        files: {
          'tmp/dev_options.js': ['test/fixtures/vx.glsl', 'test/fixtures/fx.glsl']
        }
      },
      dist_options: {
        options: {
          oneString: true,
          stripComments: true
        },
        files: {
          'tmp/dist_options.js': ['test/fixtures/vx.glsl', 'test/fixtures/fx.glsl']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'glsl', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
