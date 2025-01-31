import { GetChildrenFromParentID } from '../components/hierarchy/GetChildrenFromParentID';
import { IGameObject } from '../gameobjects/IGameObject';

/**
 * Get all children from the given parent to one layer deep. Does not go any lower (see GetAllChildren)
 *
 * The children are returned in a new array. Therefore, modifying this array will not
 * mutate the parent.
 *
 * You can optionally provide a property and value to match against.
 *
 * @export
 * @param {IGameObject} parent
 * @param {string} [property]
 * @param {never} [value]
 * @returns {IGameObject[]}
 */
export function GetChildren <P extends IGameObject> (parent: P, property?: string | symbol, value?: never): IGameObject[]
{
    const children = GetChildrenFromParentID(parent.id);

    //  Fast path out of here
    if (!property)
    {
        //  Or return children ?
        return [ ...children ];
    }

    return children.filter(child =>
    {
        return (property in child && (value === undefined || child[property] === value));
    });
}
