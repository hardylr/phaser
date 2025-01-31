import * as WorldEvents from './events';

import { GetRenderChildTotal, RenderChild, ResetRenderChildTotal } from './RenderChild';
import { Query, defineQuery } from 'bitecs';

import { BaseWorld } from './BaseWorld';
import { Begin } from '../renderer/webgl1/renderpass/Begin';
import { ClearDirtyChild } from '../components/dirty/ClearDirtyChild';
import { ClearDirtyChildColor } from '../components/dirty/ClearDirtyChildColor';
import { ClearDirtyChildTransform } from '../components/dirty/ClearDirtyChildTransform';
import { ClearDirtyChildWorldTransform } from '../components/dirty/ClearDirtyChildWorldTransform';
import { ClearDirtyDisplayList } from '../components/dirty/ClearDirtyDisplayList';
import { ColorComponent } from '../components/color/ColorComponent';
import { Emit } from '../events/Emit';
import { GameObjectCache } from '../gameobjects/GameObjectCache';
import { GameObjectWorld } from '../GameObjectWorld';
import { GetFirstChildID } from '../components/hierarchy/GetFirstChildID';
import { GetNextSiblingID } from '../components/hierarchy/GetNextSiblingID';
import { HasDirtyChildColor } from '../components/dirty/HasDirtyChildColor';
import { HasDirtyChildTransform } from '../components/dirty/HasDirtyChildTransform';
import { HasDirtyChildWorldTransform } from '../components/dirty/HasDirtyChildWorldTransform';
import { HasDirtyDisplayList } from '../components/dirty/HasDirtyDisplayList';
import { IRenderPass } from '../renderer/webgl1/renderpass/IRenderPass';
import { IScene } from '../scenes/IScene';
import { IStaticCamera } from '../camera/IStaticCamera';
import { IStaticWorld } from './IStaticWorld';
import { MoveNextUpdatable } from '../components/hierarchy/MoveNextUpdatable';
import { PopColor } from '../renderer/webgl1/renderpass/PopColor';
import { QuadVertexComponent } from '../components/vertices/QuadVertexComponent';
import { RebuildWorldTransforms } from './RebuildWorldTransforms';
import { RendererInstance } from '../renderer/RendererInstance';
import { SetColor } from '../renderer/webgl1/renderpass/SetColor';
import { SetWillCacheChildren } from '../components/permissions/SetWillCacheChildren';
import { SetWillTransformChildren } from '../components/permissions/SetWillTransformChildren';
import { Transform2DComponent } from '../components/transform/Transform2DComponent';
import { UpdateInViewSystem } from '../components/vertices/UpdateInViewSystem';
import { UpdateLocalTransform } from '../components/transform/UpdateLocalTransform';
import { UpdateQuadColorSystem } from '../components/color/UpdateQuadColorSystem';
import { UpdateVertexPositionSystem } from '../components/vertices/UpdateVertexPositionSystem';
import { WillRender } from '../components/permissions/WillRender';
import { WillUpdate } from '../components/permissions/WillUpdate';
import { WorldCamera } from '../camera/WorldCamera';

//  A Static World is designed specifically to have a bounds of a fixed size
//  and a camera that doesn't move at all (no scrolling, rotation, etc)
//  Because it has a fixed size, there is no camera culling enabled.
//  Games that use this kind of world include Pacman, Bejeweled and 2048.

export class StaticWorld extends BaseWorld implements IStaticWorld
{
    readonly type: string = 'StaticWorld';

    // declare camera: IStaticCamera;
    declare camera: WorldCamera;

    private colorQuery: Query;
    private transformQuery: Query;

    renderData: { gameFrame: number; dirtyLocal: number; dirtyWorld: number; dirtyQuad: number, dirtyColor: number; dirtyView: number, numChildren: number; rendered: number; renderMs: number; updated: number; updateMs: number, fps: number };

    constructor (scene: IScene)
    {
        super(scene);

        const tag = this.tag;

        this.colorQuery = defineQuery([ tag, ColorComponent, QuadVertexComponent ]);
        this.transformQuery = defineQuery([ tag, Transform2DComponent ]);

        const renderer = RendererInstance.get();

        // this.camera = new StaticCamera(renderer.width, renderer.height);
        this.camera = new WorldCamera(renderer.width, renderer.height);

        this.renderData = {
            gameFrame: 0,
            dirtyLocal: 0,
            dirtyWorld: 0,
            dirtyQuad: 0,
            dirtyColor: 0,
            dirtyView: 0,
            numChildren: 0,
            rendered: 0,
            renderMs: 0,
            updated: 0,
            updateMs: 0,
            fps: 0
        };

        SetWillTransformChildren(this.id, false);
        SetWillCacheChildren(this.id, false);
    }

    preRender (gameFrame: number): boolean
    {
        const id = this.id;

        const renderData = this.renderData;

        renderData.gameFrame = gameFrame;
        renderData.rendered = 0;

        ClearDirtyChild(id);

        const camera = this.camera;
        const cameraUpdated = camera.updateBounds();

        const entities = this.transformQuery(GameObjectWorld);

        let dirtyLocal = 0;
        let dirtyWorld = 0;
        let dirtyQuad = 0;
        let dirtyColor = 0;
        let dirtyView = 0;

        if (HasDirtyChildTransform(id))
        {
            dirtyLocal = UpdateLocalTransform(id, entities, camera, gameFrame);

            ClearDirtyChildTransform(id);
        }

        if (HasDirtyChildWorldTransform(id))
        {
            dirtyWorld = RebuildWorldTransforms(entities);

            dirtyQuad = UpdateVertexPositionSystem(entities, camera, gameFrame);

            ClearDirtyChildWorldTransform(id);
        }

        if (HasDirtyChildColor(id))
        {
            dirtyColor = UpdateQuadColorSystem(this.colorQuery(GameObjectWorld));

            ClearDirtyChildColor(id);
        }

        if (HasDirtyDisplayList(id))
        {
            this.getNumChildren();

            ClearDirtyDisplayList(id);
        }

        const totalUpdated = dirtyLocal + dirtyQuad;

        if (cameraUpdated && totalUpdated !== entities.length)
        {
            dirtyView = UpdateInViewSystem(entities, camera, gameFrame);
        }

        renderData.dirtyLocal = dirtyLocal;
        renderData.dirtyWorld = dirtyWorld;
        renderData.dirtyQuad = dirtyQuad;
        renderData.dirtyColor = dirtyColor;
        renderData.dirtyView = dirtyView;
        renderData.rendered = GetRenderChildTotal();

        return true;
    }

    update (delta: number, time: number): void
    {
        Emit(this, WorldEvents.WorldBeforeUpdateEvent, this);

        const start = performance.now();

        let next = GetFirstChildID(this.id);

        let total = 0;

        while (next > 0)
        {
            if (WillUpdate(next))
            {
                GameObjectCache.get(next).update(delta, time);

                total++;
            }

            next = MoveNextUpdatable(next);
        }

        this.renderData.updated = total;
        this.renderData.updateMs = performance.now() - start;

        Emit(this, WorldEvents.WorldUpdateEvent, this);
    }

    renderGL <T extends IRenderPass> (renderPass: T): void
    {
        SetColor(renderPass, this.color);

        Emit(this, WorldEvents.WorldRenderEvent, this);

        const camera = this.camera;
        const renderData = this.renderData;

        const start = performance.now();

        Begin(renderPass, camera);

        ResetRenderChildTotal();

        let id = GetFirstChildID(this.id);

        while (id > 0)
        {
            if (WillRender(id))
            {
                RenderChild(renderPass, id);
            }

            id = GetNextSiblingID(id);
        }

        camera.isDirty = false;

        PopColor(renderPass, this.color);

        renderData.renderMs = performance.now() - start;

        //#ifdef RENDER_STATS
        renderData.numChildren = this.getNumChildren();
        renderData.fps = this.scene.game.time.fps;
        window['renderStats'] = renderData;
        //#endif

        Emit(this, WorldEvents.WorldPostRenderEvent, renderPass, this);
    }
}
