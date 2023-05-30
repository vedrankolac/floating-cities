import { Rectangle } from "../../utils/Rectangle";
import { Parcel } from "./Parcel";
import { Train } from "./Train";
import { Particles } from "./Particles";

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
  }

  create = () => {
    this.parcels = [];
    this.trains = [];

    console.log('Structure::create');

    // DEFINE SPLIT AND DENSITY

    // const strWidth = 0.6;
    // const strDepth = 0.2;
    // const strWidth = 2.0;
    // const strDepth = 1.2;
    const strWidth = Math.random() * 1.4 + 0.6;
    const strDepth = Math.random() * 0.6 + 0.6;
    
    // const roadWidth = 0.16;
    const roadWidth = Math.random() * 0.04 + 0.16;

    // split on no less than 30% of width
    const splitIndex = Math.random() * 0.7 + 0.15;
    // const splitIndex = 0.10;
    const split_x = -strWidth + splitIndex * strWidth * 2;

    const rectangleBase1 = new Rectangle(-strWidth, -strDepth, split_x - roadWidth/2, strDepth);
    const rectangleBase2 = new Rectangle(split_x + roadWidth/2, -strDepth, strWidth, strDepth);

    const densityIndex1 = (1-splitIndex) * 40;
    const densityIndex2 = splitIndex * 40;

    // console.log('densityIndex1', densityIndex1);
    // console.log('densityIndex2', densityIndex2);

    const densityBase1 = Math.round(Math.random() * densityIndex1 + 2);
    const densityBase2 = Math.round(Math.random() * densityIndex2 + 2);

    // console.log('densityBase1', densityBase1);
    // console.log('densityBase2', densityBase2);

    // DEFINE LEVELS

    const b1 = 1.52;
    const b2 = Math.random() * (1.52-0.8) +  0.8;

    const bIndex = Math.random();

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
      this.envMap,
      this.parcels
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
      this.envMap,
      this.parcels
    );
    const base2Area = rectangleBase2.width() * rectangleBase2.height();
    base2.split(0, 8, base2Area, 1.2);

    this.parcels.push(base1);
    this.parcels.push(base2);

    // MAKE TRAINS

    const trainA = new Train(
      roadWidth,
      split_x,
      0,
      b2,
      'z',
      this.hue,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );

    let yLevel = b1;
    if ((b2 - b1) < (0.14 + 0.02 * 2)) {
      yLevel = b2 + 0.14 + 0.02 * 2;
    }

    const trainB = new Train(
      roadWidth,
      0,
      -strDepth - roadWidth/2,
      yLevel,
      'x',
      this.hue,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );

    this.trains.push(trainA);
    this.trains.push(trainB);

    // const trainC = new Train(
    //   roadWidth,
    //   0,
    //   strDepth + roadWidth/2,
    //   yLevel,
    //   'x',
    //   this.hue,
    //   this.scene,
    //   this.loop,
    //   this.physicsWorld,
    //   this.envMap
    // );

    // MAKE PARTICLES
    this.particles = new Particles(strWidth, strDepth, b1, 3.2, this.scene, this.loop, this.envMap);
  }

  destroy = () => {
    console.log('Structure::destroy');

    // destroy all parcels
    for (let i = 0; i < this.parcels.length; i++) {
      let parcel = this.parcels[i];
      parcel.destroy();
      parcel = null;
    }

    this.particles.destroy();
    this.particles = null;

    // destroy all trains
    for (let j = 0; j < this.trains.length; j++) {
      let train = this.trains[j];
      train.destroy();
      train = null;
    }
  }
}