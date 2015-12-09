# grunt-glsl [![Build Status](https://travis-ci.org/marcopompili/grunt-glsl.svg?branch=master)](https://travis-ci.org/marcopompili/grunt-glsl)

> Translate GLSL shader files into javascript.

## Setting up your GLSL source files

First you have to set the headers for grunt-glsl in your shader files.

For example a vertex shader file called vx.glsl:

```glsl
//#gljs varname: 'vertex_shader_src'

varying vec3 vertex;
void main() {
  vertex = vec3(position.x * 3.0, position.y * 6.0, position.z * 3.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}
```

Then a fragment shader file called fx.glsl:

```glsl
//#gljs varname: 'fragment_shader_src'

#extension GL_OES_standard_derivatives : enable
varying vec3 vertex;
void main() {
  // Pick a coordinate to visualize in a grid
  vec2 coord = vertex.xz;

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)) * vec3(0.0, 0.2, 0.22), 1.0);
}
```

The top header is basically CSON, apart from the first 5 characters that
identify that the comment line is a header for grunt-glsl.

The key 'varname' carries the value of the variable name for the javascript
file.

## Getting Started with Grunt

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

Will use the two shader files above in these examples.

In your project's Gruntfile, add a section named `glsl` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  glsl: {
    dev: {
      options: {
        oneString: false
      }
      files: {
        'shaders.js': ['vx.glsl', 'fx.glsl' ]
      }
    }
    dist: {
      options: {
        oneString: true
      }
      files: {
        'shaders.js': ['vx.glsl', 'fx.glsl' ]
      }
    },
  },
});
```

Result for the glsl:dev task:

```javascript
var vertex_shader_src = [
'varying vec3 vertex;',
'void main() {',
'  vertex = vec3(position.x * 3.0, position.y * 6.0, position.z * 3.0);',
'  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);',
'}',
].join("\n");
var fragment_shader_src = [
'#extension GL_OES_standard_derivatives : enable',
'varying vec3 vertex;',
'void main() {',
'  // Pick a coordinate to visualize in a grid',
'  vec2 coord = vertex.xz;',
'  // Compute anti-aliased world-space grid lines',
'  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);',
'  float line = min(grid.x, grid.y);',
'  // Just visualize the grid lines directly',
'  gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)) * vec3(0.0, 0.2, 0.22), 1.0);',
'}',
].join("\n");
```

Result for the glsl:dist task:

```javascript
var vertex_shader_src = "varying vec3 vertex;\nvoid main() {\n  vertex = vec3(position.x * 3.0, position.y * 6.0, position.z * 3.0);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);\n}\n";
var fragment_shader_src = "#extension GL_OES_standard_derivatives : enable\nvarying vec3 vertex;\nvoid main() {\n  // Pick a coordinate to visualize in a grid\n  vec2 coord = vertex.xz;\n  // Compute anti-aliased world-space grid lines\n  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);\n  float line = min(grid.x, grid.y);\n  // Just visualize the grid lines directly\n  gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)) * vec3(0.0, 0.2, 0.22), 1.0);\n}\n";
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

#### Using glslOptimizer

From release 0.2.0 glslOptimizer support has been added.
I had to prepare a [custom fork](https://www.npmjs.com/package/marcs-glsl-optimizer) from
the original
[glslOptimizer](https://github.com/aras-p/glsl-optimizer)
by Aras Pranckevičius. Maybe the fork stil needs some fixing,
but should mostly work fine.

Here an example of how to use the optimizer in a task:

```js
glsl_options: {
  options: {
    stripComments: true,
    optimize: true,
    target: 'es3' //default is 'es3', target also accept 'es2'
  },
  files: {
    'tmp/glsl_options.js': [
      'test/fixtures/glsl120-basic-in.frag',
      'test/fixtures/glsl120-basic-out.frag'
    ]
  }
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

*   2015-11-09   v0.1.1    Work in progress somewhat working, lacks good docs.
*   2015-11-20   v0.1.21   Fixed repository's infos.
*   2015-11-20   v0.1.3    Better docs, bug fixes, real life test files.
*   2015-12-12   v0.2.0    Support for glslOptimizer
