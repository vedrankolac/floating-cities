import { Rectangle } from "../../utils/Rectangle";
import { Parcel } from "./Parcel";

import { cube } from "./cube";
import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";

export class Structure {
  constructor(
    scene,
    loop,
    physicsWorld,
    envMap,
    hue
  ) {
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
    this.hue = hue;
    this.start();
  }

  start = () => {
    console.log('Structure::start');

    // DEFINE SPLIT AND DENSITY

    // const strWidth = 0.6;
    // const strDepth = 0.2;
    // const strWidth = 2.0;
    // const strDepth = 1.2;
    const strWidth = $fx.rand() * 1.4 + 0.6;
    const strDepth = $fx.rand() * 0.6 + 0.6;
    
    // const roadWidth = 0.4;
    const roadWidth = $fx.rand() * 0.3 + 0.1;

    // split on no less than 20% of width
    const splitIndex = $fx.rand() * 0.7 + 0.15;
    // const splitIndex = 0.10;
    const split_x = -strWidth + splitIndex * strWidth * 2;

    const rectangleBase1 = new Rectangle(-strWidth, -strDepth, split_x - roadWidth/2, strDepth);
    const rectangleBase2 = new Rectangle(split_x + roadWidth/2, -strDepth, strWidth, strDepth);

    const densityIndex1 = (1-splitIndex) * 40;
    const densityIndex2 = splitIndex * 40;

    console.log('densityIndex1', densityIndex1);
    console.log('densityIndex2', densityIndex2);

    const densityBase1 = Math.round($fx.rand() * densityIndex1 + 2);
    const densityBase2 = Math.round($fx.rand() * densityIndex2 + 2);

    console.log('densityBase1', densityBase1);
    console.log('densityBase2', densityBase2);

    // DEFINE LEVELS

    const b1 = 1.52;
    const b2 = Math.random() * (1.52-0.8) +  0.8;

    const bIndex = $fx.rand();

    let yDownShiftBase1 = null;
    let yDownShiftBase2 = null;

    if (bIndex > 0.5) {
      yDownShiftBase1 = b1;
      yDownShiftBase2 = b2;
    } else {
      yDownShiftBase1 = b2;
      yDownShiftBase2 = b1;
    }

    // MAKE PARCELS

    const base1 = new Parcel(
      rectangleBase1,
      densityBase1,
      this.hue,
      yDownShiftBase1,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );
    const base1Area = rectangleBase1.width() * rectangleBase1.height();
    base1.split(0, 8, base1Area, 1.2);
    
    const base2 = new Parcel(
      rectangleBase2,
      densityBase2,
      this.hue + 0.7,
      yDownShiftBase2,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );
    const base2Area = rectangleBase2.width() * rectangleBase2.height();
    base2.split(0, 8, base2Area, 1.2);

    // MAKE ROAD AND TRAIN

    const color = hslToHex(0, 0.0, 0.02);
    const material = canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02});
    const item = cube(
      material,
      {
        width:  roadWidth + 0.02,
        height: 0.01,
        depth:  4
      },
      {
        x: split_x,
        y: -b2,
        z: 0
      },
      {
        x: 0,
        y: 0,
        z: 0
      },
      this.physicsWorld,
      'fixed'
    );
    this.scene.add(item.mesh);
    this.loop.bodies.push(item);

  }
}