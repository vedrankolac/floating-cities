import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { Cube } from "./highlevel/Cube";

export class TowerStackHorizontally {
  constructor(
    height,
    yDownShift,
    hue,
    rectangle,
    envMap,
    physicsWorld,
    scene
  ) {
    this.height = height;
    this.yDownShift = yDownShift;
    this.hue = hue;
    this.rectangle = rectangle;
    this.envMap = envMap;
    this.physicsWorld = physicsWorld;
    this.scene = scene;

    this.cubes = [];
    this.create();
  }

  create = () => {
    const cIndex = randomM2();
    let color;

    // color = hslToHex(0, 0.0, 0.0); // black

    if (cIndex < 0.4) {
      // color = (randomM2() > 0.5) ? hslToHex(0, 0.0, 0.6) : hslToHex(this.hue, randomM2()*0.6 + 0.3, 0.4); // white or color
      this.color = (randomM2() > 0.5) ? hslToHex(0, 0.0, 0.6) : hslToHex(0, 0.0, randomM2()*0.6); // white or gray
    } else if (cIndex >= 0.40 && cIndex < 0.70) {
      this.color = hslToHex(0, 0.0, 0.0); // black
    } else if (cIndex >= 0.70 && cIndex < 1.0) {
      this.color = hslToHex(0, 0.0, randomM2()*0.6); // gray
    }

    const width = this.rectangle.width() - 0.02;
    const depth = this.rectangle.height() - 0.02;
    
    this.material = canvasTextureMaterial({ envMap: this.envMap }, { color: this.color, roughness: 0.6, metalness: 0.02});

    const nBlocks = Math.floor(randomM3() * 6 + 3);
    const blockWidth = width/nBlocks;

    const cw = width + blockWidth/4 + 0.02/2;
    const cbw = cw / nBlocks;

    const initX = this.rectangle.x1 + 0.02/2 + blockWidth/4;
    const initY = this.height/2 - this.yDownShift - randomM3()*(this.height/6)

    for (let i = 0; i < nBlocks; i++) {
      const cube = new Cube(
        this.material,
        {
          width: blockWidth * 0.5,
          height: this.height,
          depth
        },
        {
          x: initX + i * cbw,
          y: initY,
          z: this.rectangle.center().y
        },
        {
          x: 0,
          y: 0,
          z: 0
        },
        'none',
        this.physicsWorld
      );

      this.cubes.push(cube);
      this.scene.add(cube.mesh);
    }
  }

  destroy = () => {
    this.material.dispose();

    for (let i = 0; i < this.cubes.length; i++) {
      const cube = this.cubes[i];
      this.scene.remove(cube.mesh);
      cube.destroy(); 
    }
  }
}