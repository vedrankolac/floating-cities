import { Rectangle } from "../../utils/Rectangle";
import { Parcel } from "./Parcel";

export class Structure {
  constructor(
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
    this.start();
  }

  start = () => {
    console.log('Structure::start');

    // const strWidth = 0.6;
    // const strDepth = 0.2;
    // const strWidth = 2.0;
    // const strDepth = 1.2;
    const strWidth = $fx.rand() * 1.4 + 0.6;
    const strDepth = $fx.rand() * 0.6 + 0.6;
    
    // const roadWidth = 0.4;
    const roadWidth = $fx.rand() * 0.2 + 0.2;

    // const hue = $fx.rand();
    const hue = 0.5;

    // MAKE PARCELS

    const splitIndex = $fx.rand() * 0.7 + 0.15;
    const split_x = -strWidth + splitIndex * strWidth;

    const rectangleBase1 = new Rectangle(-strWidth, -strDepth, split_x - roadWidth/2, strDepth);
    const rectangleBase2 = new Rectangle(split_x + roadWidth/2, -strDepth, strWidth, strDepth);

    const densityBase1 = Math.round($fx.rand() * 60 + 2);
    const densityBase2 = Math.round($fx.rand() * 60 + 2);
    console.log('densityBase1', densityBase1);
    console.log('densityBase2', densityBase2);

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

    const base1 = new Parcel(
      rectangleBase1,
      densityBase1,
      hue,
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
      hue + 0.7,
      yDownShiftBase2,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );
    const base2Area = rectangleBase2.width() * rectangleBase2.height();
    base2.split(0, 8, base2Area, 1.2);
  }
}