import { Vec4 } from './Vec4';

export function RoundToZero (a: Vec4, out: Vec4 = new Vec4()): Vec4
{
    const { x, y, z, w } = a;

    return out.set(
        (x < 0) ? Math.ceil(x) : Math.floor(x),
        (y < 0) ? Math.ceil(y) : Math.floor(y),
        (z < 0) ? Math.ceil(z) : Math.floor(z),
        (w < 0) ? Math.ceil(w) : Math.floor(w)
    );
}
