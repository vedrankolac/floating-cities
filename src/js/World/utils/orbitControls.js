import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const orbitControls = (camera, domElement) => {
  const oc = new OrbitControls(camera, domElement);
  // oc.maxPolarAngle = Math.PI/2 - Math.PI/32;
  // oc.minPolarAngle = Math.PI/32;
  // oc.maxDistance = 40;
  // oc.minDistance = 3;
  // oc.dampingFactor = 100;
  oc.autoRotate = true;
  oc.autoRotateSpeed = 1.0;
  oc.enablePan = true;
  return oc;
}

export { orbitControls }