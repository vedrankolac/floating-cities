import { cube } from "../bodies/cube";
import { defaultColorMattPlastic } from "../materials/defaultColorMattPlastic";
import { hslToHex } from "../../utils/colorUtils";

export const pedestals = (
  scene,
  loop,
  physicsWorld,
  envMap,
  colorComposition,
  props
) => {
  const color = colorComposition.bg.color;
  const material = defaultColorMattPlastic(color, 1, envMap);

  // const n = Math.round($fx.rand());
  const n = 0;

  for (let i = 0; i <= n; i++) {
    const w = $fx.rand() * 16 + 8;
    const d = $fx.rand() * 3 + 0.3;
    const h  = $fx.rand() * 1.2 + 0.2;
    const size = {width: w, height: h, depth: d}
    let translation = null;

    if (i === 0) {
      // translation = {x: -w/2, y: h/2, z: -d/2}
      translation = {x: -w/2 + w/10, y: h/2, z: -d/2 + d/10 }
    }

    if (i === 1) {
      translation = {x: w/2, y: h/2, z: -d/2}
    }

    if (i === 2) {
      translation = {x: w/2, y: h/2, z: d/2}
    }

    if (i === 3) {
      translation = {x: -w/2, y: h/2, z: d/2}
    }

    const rotation = {x: 0, y: 0, z: 0}
    const cubeItem = cube(material, size, translation, rotation, physicsWorld);
    scene.add(cubeItem.mesh);
    loop.bodies.push(cubeItem);
  }
}