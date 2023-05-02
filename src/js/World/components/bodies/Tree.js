import { hslToHex } from "../../utils/colorUtils";
import {
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line
} from 'three';

export class Tree {
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
    this.draw();
  }

  draw = () => {
    console.log('+++ drawTree');
    const color = hslToHex(this.hue, 0.0, 0.0)
    const material = new LineBasicMaterial({color: color});

    const width = this.rectangle.width() - 0.02;
    const depth = this.rectangle.height() - 0.02;

    const maxHeight = 3.2;
    const hIndex = $fx.rand();
    const height = (hIndex>0.5)
      ? $fx.rand() * maxHeight + 0.04
      : width * Math.round($fx.rand() * 4.6);

      console.log(this.rectangle.center().x, this.rectangle.center().y);

      const points = [];
      let yInit = -this.yDownShift;

      while (condition) {
        const point = new Vector3(
          this.rectangle.center().x + $fx.rand() * this.rectangle.width() - this.rectangle.width()/2,
          yCount,
          this.rectangle.center().y + $fx.rand() * this.rectangle.height() - this.rectangle.height()/2,
        )
        points.push(point);
        yCount += 0.02;
      }

      // for (let i = 0; i < 32; i++) {
      //   const point = new Vector3(
      //     this.rectangle.center().x + $fx.rand() * this.rectangle.width() - this.rectangle.width()/2,
      //     yCount,
      //     this.rectangle.center().y + $fx.rand() * this.rectangle.height() - this.rectangle.height()/2,
      //   )
      //   points.push(point);
      //   yCount += 0.02;
      // }

    // const points = [
    //   new Vector3(
    //     this.rectangle.center().x,
    //     -this.yDownShift,
    //     this.rectangle.center().y
    //   ),
    //   new Vector3(
    //     this.rectangle.center().x, 
    //     -this.yDownShift + height,
    //     this.rectangle.center().y
    //   )
    // ];

    const geometry = new BufferGeometry().setFromPoints(points);
    const mesh = new Line(geometry, material);
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;

    this.scene.add(mesh);
  }
}