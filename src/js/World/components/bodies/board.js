import { cube } from "../bodies/cube";
import { hslToHex } from "../../utils/colorUtils";
import { defaultColorMattPlastic } from "../materials/defaultColorMattPlastic";

export const board = (borderDepth, envMap, physicsWorld, scene, loop) => {

  const colorBack = hslToHex(0.6, 0, 0.99);
  const backMaterial = defaultColorMattPlastic(colorBack, 1, envMap);

  const colorBorder = hslToHex(0.4, 0, 0.6);
  const borderMaterial = defaultColorMattPlastic(colorBorder, 1, envMap);
  
  // back

  const backDepth = 0.02;
  const backSize = 6;
  
  const back = cube(
    backMaterial,
    {
      width:  backSize,
      height: backSize,
      depth:  backDepth
    },
    {
      x: 0,
      y: 0.5,
      z: -backDepth/2
    },
    {
      x: 0,
      y: 0,
      z: 0
    },
    physicsWorld,
    'fixed'
  );
  scene.add(back.mesh);
  loop.bodies.push(back);

  // front

  const frontDepth = 0.02;
  const front = cube(
    backMaterial,
    {
      width:  1,
      height: 1,
      depth:  backDepth
    },
    {
      x: 0,
      y: 0.5,
      z: frontDepth/2 + borderDepth
    },
    {
      x: 0,
      y: 0,
      z: 0
    },
    physicsWorld,
    'fixed'
  );
  // dont add it to scene because we don't want it
  // scene.add(front.mesh);
  loop.bodies.push(front);

  // borders

  // const borderTop = cube(
  //   borderMaterial,
  //   {
  //     width:  1,
  //     height: borderDepth,
  //     depth:  borderDepth
  //   },
  //   {
  //     x: 0,
  //     y: 1 -borderDepth/2,
  //     z: borderDepth/2
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   physicsWorld,
  //   'fixed'
  // );
  // scene.add(borderTop.mesh);
  // loop.bodies.push(borderTop);

  // const borderBottom = cube(
  //   borderMaterial,
  //   {
  //     width:  1,
  //     height: borderDepth,
  //     depth:  borderDepth
  //   },
  //   {
  //     x: 0,
  //     y: borderDepth/2,
  //     z: borderDepth/2
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   physicsWorld,
  //   'fixed'
  // );
  // scene.add(borderBottom.mesh);
  // loop.bodies.push(borderBottom);

  // const borderLeft = cube(
  //   borderMaterial,
  //   {
  //     width:  borderDepth,
  //     height: 1 - borderDepth*2,
  //     depth:  borderDepth
  //   },
  //   {
  //     x: -1/2 + borderDepth/2,
  //     y: 1/2,
  //     z: borderDepth/2
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   physicsWorld,
  //   'fixed'
  // );
  // scene.add(borderLeft.mesh);
  // loop.bodies.push(borderLeft);

  // const borderRight = cube(
  //   borderMaterial,
  //   {
  //     width:  borderDepth,
  //     height: 1 - borderDepth*2,
  //     depth:  borderDepth
  //   },
  //   {
  //     x: 1/2 - borderDepth/2,
  //     y: 1/2,
  //     z: borderDepth/2
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   },
  //   physicsWorld,
  //   'fixed'
  // );
  // scene.add(borderRight.mesh);
  // loop.bodies.push(borderRight);

  return {
    back,
    front
  }
}