import { sphereKinematic } from '../components/bodies/sphereKinematic';
import { cubeKinematic } from '../components/bodies/cubeKinematic';
import { hslToHex } from '../utils/colorUtils';
import { defaultColorShinyPlastic } from '../components/materials/defaultColorShinyPlastic';

const createHandsPhysicsController = (scene, loop, physicsWorld, vrControls) => {
  const colorMaterialRight = defaultColorShinyPlastic(
    hslToHex(0.6, 1, 0.2)
  );

  const colorMaterialLeft = defaultColorShinyPlastic(
    hslToHex(0, 1, 0.2)
  );

  // const size = {
  //   width:  0.05,
  //   height: 0.05,
  //   depth:  0.05
  // }
  const size = {
    radius: 0.04
  }
  const translation = {
    x: 0,
    y: 0,
    z: 0
  }
  const rotation = {
    x: 0,
    y: 0,
    z: 0
  }

  const rightHandAsset = sphereKinematic(colorMaterialRight, size, translation, rotation, physicsWorld);
  scene.add(rightHandAsset.mesh);
  loop.kinematicPositionBasedBodies.push(rightHandAsset);
  vrControls.addAssetToRightHand(rightHandAsset.mesh);

  const leftHandAsset = sphereKinematic(colorMaterialLeft, size, translation, rotation, physicsWorld);
  scene.add(leftHandAsset.mesh);
  loop.kinematicPositionBasedBodies.push(leftHandAsset);
  vrControls.addAssetToLeftHand(leftHandAsset.mesh);
}

export { createHandsPhysicsController };