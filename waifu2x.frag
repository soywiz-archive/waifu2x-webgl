precision mediump float;

varying vec2 vVertexPosition;
uniform sampler2D tex0;
uniform vec2 pixelScale;
uniform vec2 tex0Scale;

uniform sampler2D bias;
uniform vec2 biasScale;

uniform sampler2D kernel;
uniform vec2 kernelScale;

float getBias(int index) {
    return texture2D(bias, vec2(float(index) / biasScale.x, float(index / 1024) / biasScale.x)).r;
}

mat3 getKernel(int x, int y, int z) {
    //return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
    return mat3(vec3(1.0), vec3(1.0), vec3(1.0));
}

void main(void) {
    ivec2 pos = ivec2(vVertexPosition.xy);
    //vec4 v = texture2D(tex0, vec2(pos.x / tex0Scale.x, 0));
    vec4 acc = vec4(getBias(pos.x));

    const int NUM_INPUTS = 16;

    for (int n = 0; n < NUM_INPUTS; n++) {
        acc += 0.01;
    }

    //gl_FragColor = vec4(pos.x / pixelScale.x, pos.y / pixelScale.y, 1.0, 1.0);

    gl_FragColor = vec4(acc.rgb, 1.0);
}