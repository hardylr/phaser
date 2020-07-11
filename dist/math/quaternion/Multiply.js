import {Quaternion as Quaternion2} from "./Quaternion";
export function Multiply(a, b, out = new Quaternion2()) {
  const {x: ax, y: ay, z: az, w: aw} = a;
  const {x: bx, y: by, z: bz, w: bw} = b;
  return out.set(ax * bw + aw * bx + ay * bz - az * by, ay * bw + aw * by + az * bx - ax * bz, az * bw + aw * bz + ax * by - ay * bx, aw * bw - ax * bx - ay * by - az * bz);
}
