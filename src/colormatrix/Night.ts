import { DEFAULT_COLOR_OFFSET } from './consts';
import { IContainer } from '../gameobjects/container/IContainer';
import { SetColorMatrix } from './SetColorMatrix';

export function Night <T extends IContainer> (gameObject: T, intensity: number = 0.1, multiply: boolean = false): T
{
    const values = [
        intensity * (-2.0), -intensity, 0, 0,
        -intensity, 0, intensity, 0,
        0, intensity, intensity * 2.0, 0,
        0, 0, 0, 1
    ];

    if (SetColorMatrix(gameObject.id, values, DEFAULT_COLOR_OFFSET, multiply))
    {
        gameObject.color.colorMatrixEnabled = true;
    }

    return gameObject;
}
