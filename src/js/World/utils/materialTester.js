import { PlaneGeometry, MathUtils, Mesh, Color } from 'three';
import { canvasTextureMaterial } from "../components/materials/canvasTextureMaterial";
import { GUI } from 'dat.gui';
import { PerlinNoise } from '../components/canvasMaps/PerlinNoise';

export const materialTester = scene => {
  let normalMap = null;
  let maps = new PerlinNoise();

  const material = canvasTextureMaterial({...maps}, {roughness: 1, metalness: 0}, 1);

  const planeGeom = new PlaneGeometry(2, 2, 4, 4);
  const plane = new Mesh(planeGeom, material);
  plane.rotation.x = 5.1;
  plane.rotation.y = 0.86;
  plane.rotation.z = 2.3;
  plane.position.x = 4.1;
  plane.position.y = 4.4;
  plane.position.z = 3.3;
  scene.add(plane);

  const gui = new GUI();
  const cubeFolder = gui.addFolder('Material Plane');
  cubeFolder.add(plane.rotation, 'x', 0, MathUtils.degToRad(360));
  cubeFolder.add(plane.rotation, 'y', 0, MathUtils.degToRad(360));
  cubeFolder.add(plane.rotation, 'z', 0, MathUtils.degToRad(360));
  cubeFolder.add(plane.position, 'x', -6, 8);
  cubeFolder.add(plane.position, 'y', -6, 8);
  cubeFolder.add(plane.position, 'z', -6, 8);
  cubeFolder.open();

  return plane;
}