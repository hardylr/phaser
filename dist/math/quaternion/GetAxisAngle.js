import {Quaternion as Quaternion2} from "./Quaternion";
export function GetAxisAngle(a, out = new Quaternion2()) {
  const rad = Math.acos(a.w) * 2;
  const s = Math.sin(rad / 2);
  const epsilon = 1e-6;
  if (s > epsilon) {
    out.set(a.x / s, a.y / s, a.z / s);
  } else {
    out.set(1, 0, 0);
  }
  return rad;
}
