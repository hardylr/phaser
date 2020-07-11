import {RectangleToRectangle as RectangleToRectangle2} from "../geom/intersects/RectangleToRectangle";
export function Overlap(source, ...targets) {
  const sourceBounds = source.bounds.get();
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const targetBounds = target.bounds.get();
    if (RectangleToRectangle2(sourceBounds, targetBounds)) {
      return true;
    }
  }
  return false;
}
