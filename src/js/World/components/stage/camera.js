import { PerspectiveCamera, Group, Vector3 } from 'three';
import { MathUtils } from 'three';

const createCamera = () => {
  const camera = new PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 300 );

  // const radius  = 1.44;
  const radius  = Math.random()*0.2 + 1;
  const polar   = MathUtils.degToRad(Math.random()*45 + (90-45/2));
  const equator = MathUtils.degToRad(Math.random()*45 + ( 0-45/2));
  // const polar   = MathUtils.degToRad(90);
  // const equator = MathUtils.degToRad(0);

  const cameraVector = new Vector3();
  cameraVector.setFromSphericalCoords(radius, polar, equator);
  camera.position.x = cameraVector.x;
  camera.position.y = cameraVector.y + 0.5;
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