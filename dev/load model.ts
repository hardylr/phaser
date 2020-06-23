import { AKey, DownKey, LeftKey, RightKey, UpKey } from '../src/input/keyboard/keys';
import { BackgroundColor, Parent, Scenes, SetWebGL, Size } from '../src/config';

import { AddChild3D } from '../src/display3d/AddChild3D';
import { AddChildren3D } from '../src/display3d/AddChildren3D';
import { Cache } from '../src/cache/Cache';
import { Camera3D } from '../src/camera3d/Camera3D';
import { Game } from '../src/Game';
import { IWorld3D } from '../src/world3d/IWorld3D';
import { ImageFile } from '../src/loader/files/ImageFile';
import { JSONFile } from '../src/loader/files/JSONFile';
import { Keyboard } from '../src/input/keyboard';
import { Loader } from '../src/loader/Loader';
import { Mesh } from '../src/gameobjects3d/mesh/Mesh';
import { On } from '../src/events';
import { Scene } from '../src/scenes/Scene';
import { VertexBuffer } from '../src/renderer/webgl1/buffers/VertexBuffer';
import { World3D } from '../src/world3d/World3D';

function CreateNonIndexedVertexBuffer (data): VertexBuffer
{
    const {
        position,
        normal,
        uv
    } = data;

    // console.log(position);
    // console.log(normal);
    // console.log(uv);

    const count = position.length / 3;
    const batchSize = count / 3;

    console.log('count', count);
    console.log('batchSize', batchSize);

    const buffer = new VertexBuffer({ batchSize, isDynamic: false, vertexElementSize: 8, elementsPerEntry: 3 });

    const F32 = buffer.vertexViewF32;

    let offset = 0;
    let uvIndex = 0;

    for (let i = 0; i < position.length; i += 3)
    {
        F32[offset++] = position[i + 0];
        F32[offset++] = position[i + 1];
        F32[offset++] = position[i + 2];
        F32[offset++] = normal[i + 0];
        F32[offset++] = normal[i + 1];
        F32[offset++] = normal[i + 2];
        F32[offset++] = uv[uvIndex + 0];
        F32[offset++] = uv[uvIndex + 1];

        uvIndex += 2;
    }

    console.log(buffer);

    buffer.count = count;

    return buffer;
}

class Demo extends Scene
{
    leftKey: LeftKey;
    rightKey: RightKey;
    upKey: UpKey;
    downKey: DownKey;
    aKey: AKey;

    world: IWorld3D;
    camMode: number = 0;
    model: Mesh;

    constructor ()
    {
        super();

        const loader = new Loader();

        if (window.location.href.includes('192.168.0.100/phaser-genesis/'))
        {
            loader.setPath('/phaser4-examples/public/assets/3d/');
        }
        else
        {
            loader.setPath('/examples/public/assets/3d/');
        }

        loader.add(ImageFile('acornTexture', 'acorn.jpg'));
        loader.add(JSONFile('acornModel', 'acorn.json'));

        loader.start().then(() => this.create());
    }

    create ()
    {
        this.world = new World3D(this);

        const json = Cache.get('JSON');
        const acorn = json.get('acornModel');

        console.log(acorn);

        const model = new Mesh(0, 0, 0);

        model.buffer = CreateNonIndexedVertexBuffer(acorn);

        model.setTexture('acornTexture');

        this.model = model;

        AddChildren3D(this.world, model);

        //  Keyboard input ...

        const keyboard = new Keyboard();

        this.leftKey = new LeftKey();
        this.rightKey = new RightKey();
        this.upKey = new UpKey();
        this.downKey = new DownKey();
        this.aKey = new AKey();

        keyboard.addKeys(this.leftKey, this.rightKey, this.upKey, this.downKey, this.aKey);

        On(this.aKey, 'keydown', () => {

            this.camMode++;

            if (this.camMode === 3)
            {
                this.camMode = 0;
            }

            console.log('cam mode: ' + this.camMode);

        });

        On(this, 'update', (delta, time) => this.update(delta, time));
    }

    update (delta: number, time: number)
    {
        const camera = this.world.camera;
        const camMode = this.camMode;
        const box = this.model;

        if (this.leftKey.isDown)
        {
            if (camMode === 0)
            {
                box.transform.position.x -= 0.05;
            }
            else if (camMode === 1)
            {
                box.transform.rotateX(-0.05);
            }
            else
            {
                camera.pitch(0.05);
            }
        }
        else if (this.rightKey.isDown)
        {
            if (camMode === 0)
            {
                box.transform.position.x += 0.05;
            }
            else if (camMode === 1)
            {
                box.transform.rotateX(0.05);
            }
            else
            {
                camera.pitch(-0.05);
            }
        }

        if (this.upKey.isDown)
        {
            if (camMode === 0)
            {
                box.transform.position.y += 0.05;
            }
            else if (camMode === 1)
            {
                box.transform.rotateY(-0.05);
            }
            else
            {
                camera.forward(0.05);
            }
        }
        else if (this.downKey.isDown)
        {
            if (camMode === 0)
            {
                box.transform.position.y -= 0.05;
            }
            else if (camMode === 1)
            {
                box.transform.rotateY(0.05);
            }
            else
            {
                camera.forward(-0.05);
            }
        }
    }
}

export default function (): void
{
    new Game(
        SetWebGL(),
        Size(800, 600),
        Parent('gameParent'),
        BackgroundColor(0x2d2d2d),
        Scenes(Demo)
    );
}
