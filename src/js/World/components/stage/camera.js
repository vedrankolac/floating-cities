import { PerspectiveCamera, Group, Vector3 } from 'three';
import { MathUtils } from 'three';
import { mapNumber } from '../../utils/numUtils';

const createCamera = () => {
  const camera = new PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 660 );
  return camera;
}

const rndPosCamera = (camera) => {
  const radius  = 10;

  const n = mapNumber(m1, 0, 1, 1, 10)
  const nexp = Math.pow(n, 2)
  const nmap = mapNumber(nexp, 1, 100, 120, 10)
  const polar   = MathUtils.degToRad(nmap);

  const equator = MathUtils.degToRad((mapNumber(m0, 0, 1, 0.5, -0.5) + 0.12) * 360);

  const cameraVector = new Vector3();
  cameraVector.setFromSphericalCoords(radius, polar, equator);
  camera.position.x = cameraVector.x;
  camera.position.y = cameraVector.y;
  camera.position.z = cameraVector.z;
}

const createDolly = (camera, scene) => {
  const dolly = new Group();
  dolly.name = "dolly";
  scene.add(dolly);
  dolly.add(camera);
  dolly.position.set(0, 0, 0);
  return dolly;
}

export {
  createCamera,
  createDolly,
  rndPosCamera
};