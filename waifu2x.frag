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

float getKernelFloat(int x, int y) {
    return texture2D(kernel, vec2(x, y) / kernelScale).r;
}

vec4 getInputTexel(int x, int y) {
    return texture2D(inp, vec2(x, y) / inpScale);
}

void main(void) {
    ivec3 pos = ivec3(vVertexPosition.xyz);

    int nOut = pos.z;

    vec4 acc = vec4(getBias(nOut));

    for (int nIn = 0; nIn < NUM_INPUTS; nIn++) {
        int blockColumn = int(mod(float(nIn), 16.0));
        int blockRow = int(floor(float(nIn) / 16.0));

        int x = pos.x + (blockColumn * BLOCK_SIZE);
        int y = pos.y + (blockRow * BLOCK_SIZE);

        int nIn3 = nIn * 3;
        int nOut3 = nOut * 3;

        float ma = getKernelFloat(nIn3 + 0, nOut3 + 0);
        float mb = getKernelFloat(nIn3 + 1, nOut3 + 0);
        float mc = getKernelFloat(nIn3 + 2, nOut3 + 0);

        float md = getKernelFloat(nIn3 + 0, nOut3 + 1);
        float me = getKernelFloat(nIn3 + 1, nOut3 + 1);
        float mf = getKernelFloat(nIn3 + 2, nOut3 + 1);

        float mg = getKernelFloat(nIn3 + 0, nOut3 + 2);
        float mh = getKernelFloat(nIn3 + 1, nOut3 + 2);
        float mi = getKernelFloat(nIn3 + 2, nOut3 + 2);

        vec4 a = getInputTexel(x - 1, y - 1);
        vec4 b = getInputTexel(x, y - 1);
        vec4 c = getInputTexel(x + 1, y - 1);
        vec4 d = getInputTexel(x - 1, y);
        vec4 e = getInputTexel(x, y);
        vec4 f = getInputTexel(x + 1, y);
        vec4 g = getInputTexel(x - 1, y + 1);
        vec4 h = getInputTexel(x, y + 1);
        vec4 i = getInputTexel(x + 1, y + 1);

        acc += (a * ma) + (b * mb) + (c * mc) + (d * md) + (e * me) + (f * mf) + (g * mg) + (h * mh) + (i * mi);
    }

    gl_FragColor = acc - ((0.9 * min(acc, vec4(0))));
}