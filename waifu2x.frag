precision mediump float;

varying vec3 vVertexPosition;

uniform sampler2D inp;
uniform vec2 inpScale;

uniform sampler2D bias;
uniform vec2 biasScale;

uniform sampler2D kernel;
uniform vec2 kernelScale;

// BIAS/KERNEL/INPUT get element data

float getBias(int index) {
    return texture2D(bias, vec2(float(index) / biasScale.x, 0)).r;
}

float getKernelFloat(int x, int y) {
    return texture2D(kernel, vec2(x, y) / kernelScale).r;
}

vec4 getInputTexel(int x, int y) {
    return texture2D(inp, vec2(x, y) / inpScale);
}

// MATRICES:

vec3 getKernelRow(int x, int y) {
    return vec3(getKernelFloat(x, y), getKernelFloat(x + 1, y), getKernelFloat(x + 2, y));
}

mat3 getKernel(int nIn, int nOut) {
    return mat3(
        getKernelRow(nIn * 3, (nOut * 3) + 0),
        getKernelRow(nIn * 3, (nOut * 3) + 1),
        getKernelRow(nIn * 3, (nOut * 3) + 2)
    );
}

// INPUT

#define getInputFloat(c, x, y) getInputTexel(x, y)[c]
#define getInputRow(c, x, y) vec3(getInputFloat(c, x - 1, y), getInputFloat(c, x, y), getInputFloat(c, x + 1, y))
#define getInput(c, x, y) mat3(getInputRow(c, x, y - 1), getInputRow(c, x, y), getInputRow(c, x, y + 1))

float cwiseDot(mat3 a, mat3 b) {
    return dot(a[0], b[0]) + dot(a[1], b[1]) + dot(a[2], b[2]);
}

void main(void) {
    ivec3 pos = ivec3(vVertexPosition.xyz);
    //vec4 v = texture2D(tex0, vec2(pos.x / tex0Scale.x, 0));

    int nOut = pos.z;

    //const int NUM_INPUTS = 128;

    vec4 acc = vec4(getBias(nOut));

    for (int nIn = 0; nIn < NUM_INPUTS; nIn++) {
        int blockColumn = int(mod(float(nIn), 16.0));
        int blockRow = int(floor(float(nIn) / 16.0));

        int x = pos.x + (blockColumn * 128);
        int y = pos.y + (blockRow * 128);

        //for (int my = 0; my < 3; my++) {
        //    for (int mx = 0; mx < 3; mx++) {
        //        acc += getInputTexel(x + mx, y + my) * vec4(getKernelFloat(nIn * 3 + mx, nOut * 3 + my));
        //    }
        //}

        mat3 krn = getKernel(nIn, nOut);
        for (int c = 0; c < 4; c++) {
            acc[c] += cwiseDot(getInput(c, x, y), krn);
        }
    }

    //gl_FragColor = max(acc, vec4(0)) + 0.1 * min(acc, vec4(0));

    gl_FragColor = acc - ((0.9 * min(acc, vec4(0))));
    //gl_FragColor.gba = vec3(gl_FragColor.r);
    //gl_FragColor = max(acc, vec4(0)) + 0.1 * min(acc, vec4(0));

    //gl_FragColor = vec4(getBias(nOut), 0, 0, 0);
    //gl_FragColor = vec4(getKernelFloat(0, 0), 0, 0, 0);
    //gl_FragColor = getInputTexel(0, 0);
    //gl_FragColor = vec4(0, 0, 0, 0);
    //gl_FragColor.r = float(z);
    //gl_FragColor.r = mod(float(int(15.2)), 10.0);
}