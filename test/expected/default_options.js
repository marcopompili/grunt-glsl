const vertex_shader_src = [
'varying vec3 vertex;',
'void main() {',
'  vertex = vec3(position.x * 3.0, position.y * 6.0, position.z * 3.0);',
'  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);',
'}'].join('\n');
const grid_fragment_src = [
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
'}'].join('\n');
