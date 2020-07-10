import { Vec3 } from './Vec3';
import { Vec3Add } from './Vec3Add';
import { Vec3Scale } from './Vec3Scale';

export function Vec3Center (a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3
{
    Vec3Add(a, b, out);

    return Vec3Scale(out, 0.5, out);
}
