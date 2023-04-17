import { cube } from "../bodies/cube";
import { defaultColorMattPlastic } from "../materials/defaultColorMattPlastic";
import { hslToHex } from "../../utils/colorUtils";

const cubes = (
  scene,
  loop,
  physicsWorld,
  envMap,
  bgHSL,
  props
) => {
  const color = (bgHSL.l > 0.5) ? hslToHex(0.6, 0, 0.8) : hslToHex(0.6, 0, 0.04);
  const blackMaterial = defaultColorMattPlastic(color, 1, envMap);
  const spreadWidth = 30;
  const {
    min,
    sizeRange,
    n = 12,
    y = 3,
    yRange = 6
  } = props;

  for (let i = 0; i < n; i++) {
    const size = {
      width:  $fx.rand() * sizeRange + min,
      height: $fx.rand() * sizeRange + min,
      depth:  $fx.rand() * sizeRange + min
    }
    const translation = {
      x: $fx.rand() * spreadWidth - spreadWidth/2,
      y: $fx.rand() * yRange + y,
      z: $fx.rand() * spreadWidth - spreadWidth/2
    }
    const rotation = {
      x: $fx.rand(),
      y: $fx.rand(),
      z: $fx.rand()
    }
    const cubeItem = cube(blackMaterial, size, translation, rotation, physicsWorld);
    scene.add(cubeItem.mesh);
    loop.bodies.push(cubeItem);
  }
}

export { cubes };