import { Quaternion } from './Quaternion';

export function Scale (a: Quaternion, scalar: number, out: Quaternion = new Quaternion()): Quaternion
{
    const { x, y, z, w } = a;

    return out.set(
        x * scalar,
        y * scalar,
        z * scalar,
        w * scalar
    );
}
