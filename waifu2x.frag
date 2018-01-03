precision mediump float;

varying vec3 vVertexPosition;

uniform sampler2D inp;
uniform vec2 inpScale;

uniform sampler2D bias;
uniform vec2 biasScale;

uniform sampler2D kernel;
uniform vec2 kernelScale;

float getBias(int index) {
    return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
}

vec4 getInputTexel(const int x, int y, int z) {
    return texture2D(bias, vec2(float(x) / inpScale.x, float(y) / inpScale.y));
}

#define getInputFloat(c, x, y, z) getInputTexel(x, y, z)[c]
#define getInputRow(c, x, y, z) vec3(getInputFloat(c, x - 1, y, z), getInputFloat(c, x, y, z), getInputFloat(c, x + 1, y, z))
#define getInput(c, x, y, z) mat3(getInputRow(c, x, y - 1, z), getInputRow(c, x, y, z), getInputRow(c, x, y + 1, z))

float sampleKernelFloat(int x, int y) {
    return texture2D(bias, vec2(float(x) / kernelScale.x, float(y) / kernelScale.y)).r;
}

vec3 sampleKernelRow(int x, int y) {
    return vec3(sampleKernelFloat(x, y), sampleKernelFloat(x + 1, y), sampleKernelFloat(x + 2, y));
}

mat3 getKernel(int inp, int outp) {
    return mat3(
        sampleKernelRow(inp * 3, (outp * 3) + 0),
        sampleKernelRow(inp * 3, (outp * 3) + 1),
        sampleKernelRow(inp * 3, (outp * 3) + 2)
    );
}

float cwiseDot(mat3 a, mat3 b) {
    return dot(a[0], b[0]) + dot(a[1], b[1]) + dot(a[2], b[2]);
}

void main(void) {
    ivec3 pos = ivec3(vVertexPosition.xyz);
    //vec4 v = texture2D(tex0, vec2(pos.x / tex0Scale.x, 0));
    vec4 acc = vec4(getBias(pos.x));
    int x = pos.x;
    int y = pos.y;
    int z = pos.z;

    //const int NUM_INPUTS = 128;

    for (int n = 0; n < NUM_INPUTS; n++) {
        //acc += sumMat(cwiseMul(getInput(x, y, z), getKernel(x, y, i)));
        mat3 krn = getKernel(n, z);
        acc.r += cwiseDot(getInput(0, x, y, z), krn);
        acc.g += cwiseDot(getInput(1, x, y, z), krn);
        acc.b += cwiseDot(getInput(2, x, y, z), krn);
        acc.a += cwiseDot(getInput(3, x, y, z), krn);
    }

    gl_FragColor = acc.rgba;
    //gl_FragColor.r = mod(float(int(15.2)), 10.0);
}