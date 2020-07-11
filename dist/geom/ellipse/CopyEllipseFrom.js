/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
export function CopyEllipseFrom(source, dest) {
  return dest.set(source.x, source.y, source.width, source.height);
}
