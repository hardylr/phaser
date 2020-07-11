import {Rectangle as Rectangle2} from "../../../geom/rectangle/Rectangle";
export function AddViewport(renderPass, x = 0, y = 0, width = 0, height = 0) {
  const viewport = new Rectangle2(x, y, width, height);
  renderPass.viewportStack.push(viewport);
  return viewport;
}
