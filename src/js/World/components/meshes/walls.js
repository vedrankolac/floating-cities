import { PlaneGeometry, SphereGeometry, Mesh, MeshStandardMaterial, MathUtils, DoubleSide } from 'three';
import { RndDotsFloor } from '../canvasMaps/RndDotsFloor';
import { canvasTextureMaterial } from '../materials/canvasTextureMaterial';
import { hslToHex } from '../../utils/colorUtils';

const walls = (scene, size, bgHSL, color) => {
  const c = hslToHex(0.6, 1, 1);
  // const maps = new RndDotsFloor(bgHSL, c, 256);

  const plastic = {
    roughness: 1,
    metalness: 0,
    n: 'plastic'
  }

  const materialFloor = canvasTextureMaterial(
    {envMap: null },
    {...plastic, c},
    1
  )

  const materialDome = new MeshStandardMaterial({
    // map: maps.colorMap,
    // normalMap: maps.normalMap,
    envMapIntensity: 100,
    side: DoubleSide,
    roughness: plastic.roughness,
    metalness: plastic.metalness,
  });

  // const geometryPlane = new PlaneGeometry(size, size, 4, 4);
  // const floor = new Mesh(geometryPlane, materialFloor);
  // floor.receiveShadow = true;
  // floor.rotation.x = MathUtils.degToRad(270);
  // scene.add(floor);

  const geometryDome = new SphereGeometry(size/2, 64, 64);
  const dome = new Mesh(geometryDome, materialDome);
  scene.add(dome);

  // let mapsKeys = Object.keys(maps);
  // mapsKeys.forEach(k => maps[k] = null);
}

export { walls };