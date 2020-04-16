/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import IEllipse from './IEllipse';
import Rectangle from '../Rectangle/Rectangle';

/**
 * Returns the bounds of the Ellipse object.
 *
 * @function Phaser.Geom.Ellipse.GetBounds
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the bounds from.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - A Rectangle, or rectangle-like object, to store the ellipse bounds in. If not given a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The Rectangle object containing the Ellipse bounds.
 */
export default function GetBounds (ellipse: IEllipse, out: Rectangle = new Rectangle()): Rectangle
{
    return out.set(
        ellipse.left,
        ellipse.top,
        ellipse.width,
        ellipse.height
    );
}
