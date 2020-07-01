import { Flush, PopShader, PopVertexBuffer, SetShader, SetVertexBuffer } from '../renderer/webgl1/renderpass';
import { Invert, Matrix4, Transpose } from '../math/mat4';

import { BaseWorld3D } from './BaseWorld3D';
import { Camera3D } from '../camera3d/Camera3D';
import { CreateWorld3DRenderData } from './CreateWorld3DRenderData';
import { GoraudLambertShader } from '../renderer/webgl1/shaders/GoraudLambertShader';
import { ICamera3D } from '../camera3d/ICamera3D';
import { IRenderPass } from '../renderer/webgl1/renderpass/IRenderPass';
import { IScene } from '../scenes/IScene';
import { IShader } from '../renderer/webgl1/shaders/IShader';
import { IWorld3D } from './IWorld3D';
import { NewCamera3D } from '../camera3d/NewCamera3D';
import { VertexBuffer } from '../renderer/webgl1/buffers/VertexBuffer';

// export class World3D extends BaseWorld3D implements IWorld3D
export class World3D extends BaseWorld3D
{
    camera: NewCamera3D;

    enableCameraCull: boolean = true;

    shader: IShader;
    normalMatrix: Matrix4;

    constructor (scene: IScene)
    {
        super(scene);

        this.type = 'World3D';

        // this.camera = new Camera3D(0, 0, 4);
        this.camera = new NewCamera3D();

        this.shader = new GoraudLambertShader();
        this.normalMatrix = new Matrix4();

        this.renderData = CreateWorld3DRenderData(this, this.camera);
    }

    renderGL <T extends IRenderPass> (renderPass: T): void
    {
        Flush(renderPass);

        const shader = this.shader;
        const camera = this.camera;
        const gl = renderPass.renderer.gl;

        const uniforms = shader.uniforms;

        //  TODO - Only if camera dirty:
        uniforms.set('uViewProjectionMatrix', camera.viewProjectionMatrix.data);
        // uniforms.set('uProjectionMatrix', camera.projectionMatrix.data);
        // uniforms.set('uCameraMatrix', camera.viewMatrix.data);
        // uniforms.set('uCameraMatrix', camera.matrix.data);

        // const normalMatrix = this.normalMatrix;

        // Invert(camera.viewMatrix, normalMatrix);
        // Transpose(normalMatrix, normalMatrix);

        // uniforms.set('uNormalMatrix', normalMatrix.data);
        // uniforms.set('uNormalMatrix', camera.viewNormal.data);

        //  TODO - Use fbo anyway to avoid z-fighting with World2D?
        // SetFramebuffer(renderPass, this.framebuffer, true);

        // SetVertexBuffer(renderPass, this.buffer);
        SetShader(renderPass, shader, 0);

        // BindTexture(this.cubeTexture);
        // const textureIndex = SetTexture(renderPass, this.cubeTexture);

        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);

        this.renderList.forEach(entry =>
        {
            if (entry.children.length > 0)
            {
                this.renderNode(entry, renderPass);
            }
            else
            {
                entry.node.renderGL(renderPass);
            }
        });
    }

    postRenderGL <T extends IRenderPass> (renderPass: T): void
    {
        const gl = renderPass.renderer.gl;

        // Flush(renderPass);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        // UnbindTexture(renderPass);

        // PopFramebuffer(renderPass);
        // PopVertexBuffer(renderPass);
        PopShader(renderPass);

        // DrawTexturedQuad(renderPass, this.texture);
    }
}
