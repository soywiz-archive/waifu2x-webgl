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

mat3 getInput(int x, int y, int z) {
    //return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
    return mat3(vec3(1.0), vec3(1.0), vec3(1.0));
}

mat3 getKernel(int x, int y, int z) {
    //return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
    return mat3(vec3(1.0), vec3(1.0), vec3(1.0));
}

// @TODO: There is an intrinsic for this?
/*
float sumMat(mat3 v) {
    return v.x.x + v.x.y + v.x.z +
    v.y.x + v.y.y + v.y.z +
    v.z.x + v.z.y + v.z.z;
}

mat3 cwiseMul(mat3 a, mat3 b) {
    // @TODO: Ensure this is right!
    return mat3(a.x * b.x, a.y * b.y, a.z * b.z);
}
*/

void main(void) {
    ivec2 pos = ivec2(vVertexPosition.xy);
    //vec4 v = texture2D(tex0, vec2(pos.x / tex0Scale.x, 0));
    vec4 acc = vec4(getBias(pos.x));
    int x = pos.x;
    int y = pos.y;
    int z = 0;

    const int num_inputs = 16;

    for (int n = 0; n < num_inputs; n++) {
        //acc += sumMat(cwiseMul(getInput(x, y, z), getKernel(x, y, i)));
        mat3 inp = getInput(x, y, z);
        mat3 krn = getKernel(x, y, n);
        acc += dot(inp[0], krn[0]) + dot(inp[1], krn[1]) + dot(inp[2], krn[2]);
    }

    //gl_FragColor = vec4(pos.x / pixelScale.x, pos.y / pixelScale.y, 1.0, 1.0);

    gl_FragColor = acc.rgba;
}