import {DIRTY_CONST as DIRTY_CONST2} from "../gameobjects/DIRTY_CONST";
export function RotateChildrenRight(parent, total = 1) {
  const parentChildren = parent.children;
  let child = null;
  for (let i = 0; i < total; i++) {
    child = parentChildren.pop();
    parentChildren.unshift(child);
    child.setDirty(DIRTY_CONST2.TRANSFORM);
  }
  return child;
}
