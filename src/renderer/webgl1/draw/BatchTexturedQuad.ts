export function BatchTexturedQuad (
    F32: Float32Array,
    offset: number,
    textureIndex: number,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    x4: number, y4: number,
    u0: number, v0: number, u1: number, v1: number,
    r: number, g: number, b: number, a: number): number
{
    //  top left
    F32[offset + 0] = x1;
    F32[offset + 1] = y1;
    F32[offset + 2] = u0;
    F32[offset + 3] = v0;
    F32[offset + 4] = textureIndex;
    F32[offset + 5] = r;
    F32[offset + 6] = g;
    F32[offset + 7] = b;
    F32[offset + 8] = a;

    //  bottom left
    F32[offset + 9] = x2;
    F32[offset + 10] = y2;
    F32[offset + 11] = u0;
    F32[offset + 12] = v1;
    F32[offset + 13] = textureIndex;
    F32[offset + 14] = r;
    F32[offset + 15] = g;
    F32[offset + 16] = b;
    F32[offset + 17] = a;

    //  bottom right
    F32[offset + 18] = x3;
    F32[offset + 19] = y3;
    F32[offset + 20] = u1;
    F32[offset + 21] = v1;
    F32[offset + 22] = textureIndex;
    F32[offset + 23] = r;
    F32[offset + 24] = g;
    F32[offset + 25] = b;
    F32[offset + 26] = a;

    //  top left
    F32[offset + 27] = x1;
    F32[offset + 28] = y1;
    F32[offset + 29] = u0;
    F32[offset + 30] = v0;
    F32[offset + 31] = textureIndex;
    F32[offset + 32] = r;
    F32[offset + 33] = g;
    F32[offset + 34] = b;
    F32[offset + 35] = a;

    //  bottom right
    F32[offset + 36] = x3;
    F32[offset + 37] = y3;
    F32[offset + 38] = u1;
    F32[offset + 39] = v1;
    F32[offset + 40] = textureIndex;
    F32[offset + 41] = r;
    F32[offset + 42] = g;
    F32[offset + 43] = b;
    F32[offset + 44] = a;

    //  top right
    F32[offset + 45] = x4;
    F32[offset + 46] = y4;
    F32[offset + 47] = u1;
    F32[offset + 48] = v0;
    F32[offset + 49] = textureIndex;
    F32[offset + 50] = r;
    F32[offset + 51] = g;
    F32[offset + 52] = b;
    F32[offset + 53] = a;

    return offset + 54;
}
