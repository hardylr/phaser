import {Vec2 as Vec22} from "./Vec2";
export function Vec2Multiply(a, b, out = new Vec22()) {
  return out.set(a.x * b.x, a.y * b.y);
}
