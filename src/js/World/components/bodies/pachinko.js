import { sphere } from "../bodies/sphere";
import { cylinder } from "../bodies/cylinder";
import { defaultColorMattPlastic } from "../materials/defaultColorMattPlastic";
import { hslToHex } from "../../utils/colorUtils";
import { MathUtils } from 'three';
import { mapNumber } from "../../utils/numUtils";
import { board as pachinkoBoard } from "./board";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";


const pachinko = (
  scene,
  loop,
  physicsWorld,
  envMap
) => {
  const borderDepth = 0.04;
  const board = pachinkoBoard(borderDepth, envMap, physicsWorld, scene, loop);

  // cylinders

  const cylinderRadius = 0.0034;
  // const cylinderRadius = Math.random() * 0.008 + 0.004;
  const cylinderHeight = borderDepth + 0.06;
  const cylinderMargin = 0.048;
  const cylinderHue = Math.random();

  // const nc = Math.round(Math.random()*4) + 12;
  const nc = 24;
  console.log('grid:     ', nc);

  const marginRect = {
    right:  0.5 - borderDepth - cylinderRadius - cylinderMargin,
    left:  -0.5 + borderDepth + cylinderRadius + cylinderMargin,
    top:      1 - borderDepth - cylinderRadius - cylinderMargin,
    bottom:       borderDepth + cylinderRadius + cylinderMargin,
  }

  const ncy = nc;
  const ncx = nc;
  for (let i = 0; i < ncx; i++) {

    let jn = ncy;
    let x_shift = 0;
    if (i % 2 !== 0) {
      jn = ncx - 1;
      x_shift = -(marginRect.left - marginRect.right)/nc/2;
    }

    for (let j = 0; j < jn; j++) {      
      const cylinderItem = cylinder(
        envMap,
        {
          radius: cylinderRadius,
          height: cylinderHeight,
        },
        {
          x: mapNumber(j, 0, ncx-1, marginRect.left + x_shift, marginRect.right + x_shift),
          y: mapNumber(i, 0, ncy-1, marginRect.top, marginRect.bottom),
          z: cylinderHeight/2
        },
        {
          x: MathUtils.degToRad(90),
          y: 0,
          z: 0
        },
        physicsWorld,
        {
          rigidBodyType: 'fixed',
          collisionEvents: true,
          hue: cylinderHue,
        }
      );
      scene.add(cylinderItem.mesh);
      loop.bodies.push(cylinderItem);
    }
  }

  // ball

  
  // const ballHue = Math.random();
  const ballHue = cylinderHue + 0.1 + Math.random()*0.1;
  // const ballHue = cylinderHue + 0.7;
  
  // const nOfBalls = Math.round(Math.random()*40) + 1;
  const nOfBalls = 60;
  console.log('balls:    ', nOfBalls);

  for (let i = 0; i < nOfBalls; i++) {
    const colorBall = hslToHex(0, 0.0, 0.02);
    const ballMaterial = canvasTextureMaterial({ envMap }, { color: colorBall, roughness: 0.2, metalness: 0.02});
    const sphereRadius = Math.random()*0.006 + 0.006;
    // const sphereRadius = 0.006;
    const sphereItem = sphere(
      ballMaterial,
      {
        radius: sphereRadius
      },
      {
        x: Math.random() * (1 - borderDepth*2 - sphereRadius*2) + (-0.5 + borderDepth + sphereRadius),
        y: 1 - borderDepth - sphereRadius,
        z: sphereRadius/2
      },
      {
        x: 0,
        y: 0,
        z: 0
      },
      physicsWorld,
      {
        collisionEvents: false,
        hue: ballHue
      }
    );
    scene.add(sphereItem.mesh);
    loop.bodies.push(sphereItem);
  }

  return board.front.mesh;
}

export { pachinko };