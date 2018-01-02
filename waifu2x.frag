precision mediump float;

varying vec2 vVertexPosition;
uniform sampler2D tex0;
uniform vec2 pixelScale;
uniform vec2 tex0Scale;

uniform sampler2D bias;
uniform vec2 biasScale;

float getBias(int index) {
    return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
}

void main(void) {
    ivec2 pos = ivec2(vVertexPosition);
    //vec4 v = texture2D(tex0, vec2(pos.x / tex0Scale.x, 0));
    float v = getBias(pos.x);

    //gl_FragColor = vec4(pos.x / pixelScale.x, pos.y / pixelScale.y, 1.0, 1.0);
    for (int n = 0; n < 10; n++) {
        gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
    }
}