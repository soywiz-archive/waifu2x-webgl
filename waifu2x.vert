precision mediump float;

attribute vec3 aPos;
varying vec3 vVertexPosition;
uniform vec2 pixelScale;

void main(void) {
    gl_Position = vec4(
        ((aPos.xy / pixelScale) * vec2(2.0)) - vec2(1.0),
        0, 1
    );
    vVertexPosition = aPos.xyz;
}
