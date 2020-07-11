import {Vec4 as Vec42} from "./Vec4";
export function ScaleAndAdd(a, b, scalar, out = new Vec42()) {
  return out.set(a.x + b.x * scalar, a.y + b.y * scalar, a.z + b.z * scalar, a.w + b.w * scalar);
}
