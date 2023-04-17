import { Rectangle } from "../../utils/Rectangle";
import { Tower } from "./Tower";

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
    const strWidth = Math.random() * 1.4 + 0.6;
    const strDepth = Math.random() * 0.6 + 0.6;
    
    // const roadWidth = 0.4;
    const roadWidth = Math.random() * 0.3 + 0.1;

    const hue = Math.random();

    const rectangleBase1 = new Rectangle(-strWidth, -strDepth, -roadWidth/2, strDepth);
    const base1 = new Tower(
      rectangleBase1,
      hue,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );
    const base1Area = rectangleBase1.width() * rectangleBase1.height();
    base1.split(0, 8, base1Area);

    const rectangleBase2 = new Rectangle(roadWidth/2, -strDepth, strWidth, strDepth);
    const base2 = new Tower(
      rectangleBase2,
      hue + 0.1,
      this.scene,
      this.loop,
      this.physicsWorld,
      this.envMap
    );
    const base2Area = rectangleBase2.width() * rectangleBase2.height();
    base2.split(0, 8, base2Area);
  }
}