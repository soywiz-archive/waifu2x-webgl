precision mediump float;

attribute vec2 aVertexPosition;
varying vec2 vVertexPosition;
uniform vec2 pixelScale;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0, 1);
    vVertexPosition = ((aVertexPosition + vec2(1, 1)) / vec2(2, 2)) * pixelScale;
}
