import { Types, defineComponent } from 'bitecs';

//  worldID = The ID of the World entity the owner of this component belongs to
//  parentID = The ID of the Parent entity. If it has no parent, will match the worldID
//  numChildren = The number of direct descendants this entity has
//  worldDepth = The distance of the entity from the world root (up to a maximum of 65535)
//  depth = Reserved to allow for per-child depth sorting outside of the display list
//  index = The position of this entity compared to its siblings, i.e. index 0 is at the back, index 1 above that, etc

const Hierarchy = defineComponent({
    worldID: Types.ui32,
    parentID: Types.ui32,
    numChildren: Types.ui32,
    depth: Types.ui32,
    index: Types.ui32,
    worldDepth: Types.ui16
});

export const HierarchyComponent = Hierarchy;
