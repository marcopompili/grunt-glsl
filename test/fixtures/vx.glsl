//#gljs varname: 'vertex_shader_src'

varying vec3 vertex;
void main() {
  vertex = vec3(position.x * 3.0, position.y * 6.0, position.z * 3.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}
