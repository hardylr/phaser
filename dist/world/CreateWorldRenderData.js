export function CreateWorldRenderData(world, camera) {
  return {
    world,
    camera,
    gameFrame: 0,
    dirtyFrame: 0,
    numRendered: 0,
    numRenderable: 0
  };
}
