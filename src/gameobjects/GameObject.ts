import { AddDirtyComponent } from '../components/dirty/AddDirtyComponent';
import { AddHierarchyComponent } from '../components/hierarchy/AddHierarchyComponent';
import { AddPermissionsComponent } from '../components/permissions/AddPermissionsComponent';
import { DestroyChildren } from '../display/DestroyChildren';
import { DestroyEvent } from './events/DestroyEvent';
import { Emit } from '../events/Emit';
import { GameObjectCache } from './GameObjectCache';
import { GameObjectTree } from './GameObjectTree';
import { GameObjectWorld } from '../GameObjectWorld';
import { GetChildrenFromParentID } from '../components/hierarchy/GetChildrenFromParentID';
import { GetNumChildren } from '../components/hierarchy/GetNumChildren';
import { GetParentGameObject } from '../components/hierarchy/GetParentGameObject';
import { GetVisible } from '../components/permissions/GetVisible';
import { GetVisibleChildren } from '../components/permissions/GetVisibleChildren';
import { HierarchyComponent } from '../components/hierarchy/HierarchyComponent';
import { ICanvasRenderer } from '../renderer/canvas/ICanvasRenderer';
import { IEventInstance } from '../events/IEventInstance';
import { IGameObject } from './IGameObject';
import { IRenderPass } from '../renderer/webgl1/renderpass/IRenderPass';
import { ReparentChildren } from '../display/ReparentChildren';
import { SetVisible } from '../components/permissions/SetVisible';
import { SetVisibleChildren } from '../components/permissions/SetVisibleChildren';
import { WillRender } from '../components/permissions/WillRender';
import { WillUpdate } from '../components/permissions/WillUpdate';
import { WillUpdateChildren } from '../components/permissions/WillUpdateChildren';
import { addEntity } from 'bitecs';

export class GameObject implements IGameObject
{
    readonly id: number = addEntity(GameObjectWorld);

    readonly type: string = 'GameObject';

    //  User defined name. Never used internally.
    name: string = '';

    events: Map<string, Set<IEventInstance>>;

    constructor ()
    {
        const id = this.id;

        AddHierarchyComponent(id);
        AddPermissionsComponent(id);
        AddDirtyComponent(id);

        GameObjectCache.set(id, this);

        this.events = new Map();
    }

    isRenderable (): boolean
    {
        return WillRender(this.id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeUpdate (delta: number, time: number): void
    {
        //  Empty for parent classes to use.
        //  Called before this GameObject and all of its children have been updated.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update (delta: number, time: number): void
    {
        //  Empty for parent classes to use.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterUpdate (delta: number, time: number): void
    {
        //  Empty for parent classes to use.
        //  Called after this GameObject and all of its children have been updated.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    preRenderGL <T extends IRenderPass> (renderPass: T): void
    {
        //  Called before this GameObject and all of its children have been rendered.
        //  If this Game Object won't render, this method is never called.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderGL <T extends IRenderPass> (renderPass: T): void
    {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderCanvas <T extends ICanvasRenderer> (renderer: T): void
    {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postRenderGL <T extends IRenderPass> (renderPass: T): void
    {
        //  Called after this GameObject and all of its children have been rendered.
        //  If this Game Object won't render, this method is never called.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postRenderCanvas <T extends ICanvasRenderer> (renderer: T): void
    {
        //  Called after this GameObject and all of its children have been rendered.
        //  If this Game Object won't render, this method is never called.
    }

    set visible (value: boolean)
    {
        SetVisible(value, this.id);
    }

    get visible (): boolean
    {
        return GetVisible(this.id);
    }

    set visibleChildren (value: boolean)
    {
        SetVisibleChildren(value, this.id);
    }

    get visibleChildren (): boolean
    {
        return GetVisibleChildren(this.id);
    }

    set depth (value: number)
    {
        HierarchyComponent.depth[this.id] = value;
    }

    get depth (): number
    {
        return HierarchyComponent.depth[this.id];
    }

    hasParent (id?: number): boolean
    {
        if (id)
        {
            return (HierarchyComponent.parent[this.id] === id);
        }
        else
        {
            return (HierarchyComponent.parent[this.id] > 0);
        }
    }

    getParent (): IGameObject | undefined
    {
        return GetParentGameObject(this.id);
    }

    getChildren (): IGameObject[]
    {
        return GetChildrenFromParentID(this.id);
    }

    getNumChildren (): number
    {
        return GetNumChildren(this.id);
    }

    //#ifdef GET_DISPLAY_DATA
    getDisplayData (): { id: number, index: number, parent: number, world: number, worldDepth: number, numChildren: number, children: number[] }
    {
        const id = this.id;

        return {
            id,
            index: HierarchyComponent.index[id],
            parent: HierarchyComponent.parent[id],
            world: HierarchyComponent.world[id],
            worldDepth: HierarchyComponent.worldDepth[id],
            numChildren: HierarchyComponent.numChildren[id],
            children: GameObjectTree.get(id)
        };
    }
    //#endif

    toString (): string
    {
        return `${this.type} id="${this.id}" name="${this.name}"`;
    }

    destroy <P extends IGameObject> (reparentChildren?: P): void
    {
        if (reparentChildren)
        {
            ReparentChildren(this, reparentChildren);
        }
        else
        {
            DestroyChildren(this);
        }

        Emit(this, DestroyEvent, this);

        this.events.clear();

        this.events = null;

        //  TODO - Destroy process, remove from Cache, Tree, etc.
    }
}
