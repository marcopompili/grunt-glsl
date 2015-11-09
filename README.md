# grunt-glsl [![Build Status](https://travis-ci.org/marcopompili/grunt-glsl.svg?branch=master)](https://travis-ci.org/marcopompili/grunt-glsl)

> Translate GLSL shader files into javascript.

## Getting Started

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-glsl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with
this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-glsl');
```

## The "grunt-glsl" task

### Overview

In your project's Gruntfile, add a section named `glsl` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  glsl: {
    options: {
      lineEndings: '\n',
    },
    dev: {
      options: {
        oneString: false
      }
      files: {
        'shaders.js': ['shader.vert', 'shader.frag', 'shader.vx.glsl' ]
      }
    }
    dist: {
      options: {
        oneString: true
      }
      files: {
        'shaders.js': ['shader.vert', 'shader.frag', 'shader.vx.glsl' ]
      }
    },
  },
});
```

### Options

#### options.lineEndings

Type: `String`
Default value: `'\n'`

This is the character used for line ending, shouldn't be necessary to override.
Line endings are correctly set automatically.

#### options.oneString

Type: `Boolean`
Default value: `false`

If set instead of using an array, the whole source of the shader will be put
on one string.

### Usage Examples

#### Default Options

In this example, the default options are used to do something with two basic
shader source files.

```js
grunt.initConfig({
  glsl: {
    options: {},
    files: {
      'dest/shaders.js': ['src/vx.glsl', 'src/fx.glsl'],
    },
  },
});
```

#### Custom Options

In this example, custom options are used to do something else with two basic
shader source files using custom options for the lineEndings and oneString
options. With oneString set to true lineEndings are completely ignored.

```js
grunt.initConfig({
  glsl: {
    options: {
      lineEndings: '\n ',
      oneString: true,
    },
    files: {
      'dest/shaders.js': ['src/vx.glsl', 'src/fx.glsl'],
    },
  },
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

*   2015-11-09   v0.1.0   Work in progress somewhat working.
