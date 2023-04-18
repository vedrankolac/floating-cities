import { PerspectiveCamera, Group, Vector3 } from 'three';
import { MathUtils } from 'three';

const createCamera = () => {
  const camera = new PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 660 );

  const radius  = 10;
  const polar   = MathUtils.degToRad(90-30);
  const equator = MathUtils.degToRad(45);
  // const radius  = $fx.rand()*0.2 + 1;
  // const polar   = MathUtils.degToRad($fx.rand()*45 + (90-45/2));
  // const equator = MathUtils.degToRad($fx.rand()*45 + ( 0-45/2));

  const cameraVector = new Vector3();
  cameraVector.setFromSphericalCoords(radius, polar, equator);
  camera.position.x = cameraVector.x;
  camera.position.y = cameraVector.y;
  camera.position.z = cameraVector.z;

  return camera;
}

const createDolly = (camera, scene) => {
  const dolly = new Group();
  dolly.name = "dolly";
  scene.add(dolly);
  dolly.add(camera);
  dolly.position.set(0, 0, 0);
  return dolly;
}

export { createCamera, createDolly };