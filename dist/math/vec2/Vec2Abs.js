import {Vec2 as Vec22} from "./Vec2";
export function Vec2Abs(a, out = new Vec22()) {
  return out.set(Math.abs(a.x), Math.abs(a.y));
}
