import { handle } from './handle';
import { sizePositionComposer } from './sizePositionComposer';
import { materialListComposer } from './materialListComposer';
import { createJoints } from './createJoints';

const pendulum = (
    scene,
    loop,
    physicsWorld,
    envMap,
    colorComposition,
    gravity
  ) => {
  const sizeAndPosition = sizePositionComposer();

  const handleComposition = {
    a: {
      colorComposition : colorComposition.a,
      size: sizeAndPosition.size.a,
      translation : sizeAndPosition.translation.a,
      rotation: {x: 0, y: 0, z: 0},
      anchor: {x: 0, y: 0, z: 0},
      volume: sizeAndPosition.volume.a,
      extremes : sizeAndPosition.extrems
    },
    b: {
      colorComposition : colorComposition.b,
      size: sizeAndPosition.size.b,
      translation : sizeAndPosition.translation.b,
      rotation: {x: 0, y: 0, z: 0},
      anchor: {x: 0, y: 0, z: 0},
      volume: sizeAndPosition.volume.b,
      extremes : sizeAndPosition.extrems
    },
    c: {
      colorComposition : colorComposition.c,
      size: sizeAndPosition.size.c,
      translation : sizeAndPosition.translation.c,
      rotation: {x: 0, y: 0, z: 0},
      anchor: {x: 0, y: 0, z: 0},
      volume: sizeAndPosition.volume.c,
      extremes : sizeAndPosition.extrems
    }
  }

  materialListComposer(handleComposition, envMap);

  const handleA = handle(handleComposition.a, physicsWorld);
  scene.add(handleA.mesh);
  loop.bodies.push(handleA);

  const handleB = handle(handleComposition.b, physicsWorld);
  scene.add(handleB.mesh);
  loop.bodies.push(handleB);

  const handleC = handle(handleComposition.c, physicsWorld);
  scene.add(handleC.mesh);
  loop.bodies.push(handleC);

  createJoints(
    handleComposition,
    loop,
    physicsWorld,
    handleA,
    handleB,
    handleC,
    gravity
  );

  return {
    handleA,
    handleB,
    handleC
  }
}

export { pendulum };