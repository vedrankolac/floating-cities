import { hslToHex } from "../../utils/colorUtils";
import {
  Mesh,
  Vector3,
  MathUtils,
  TubeGeometry,
  LineCurve3
} from 'three';
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";

export class Tree {
  constructor(
    height,
    yDownShift,
    hue,
    rectangle,
    envMap,
    physicsWorld,
    scene,
    angle,
    iterationsLimit
  ) {
    this.height = height;
    this.yDownShift = yDownShift;
    this.hue = hue;
    this.rectangle = rectangle;
    this.envMap = envMap;
    this.physicsWorld = physicsWorld;
    this.scene = scene;
    this.angle = angle;
    this.iterationsLimit = iterationsLimit;
    this.draw();
  }

  draw = () => {
    let yInit = -this.yDownShift;

    const startPoint = new Vector3(
      this.rectangle.center().x,
      yInit,
      this.rectangle.center().y,
    );

    const color = hslToHex(0.0, 0.0, 0.0);
    const material = canvasTextureMaterial({ envMap: null }, { color: color, roughness: 0, metalness: 0.0}, 0.001);

    const b = new Branch(
      startPoint,
      0,
      this.iterationsLimit,
      this.scene,
      this.rectangle,
      material,
      this.angle
    );
  }
}

class Branch {
  constructor(
    startPoint,
    iterationsCounter,
    iterationsLimit,
    scene,
    rectangle,
    material,
    angle
  ) {
    this.startPoint = startPoint;
    this.iterationsCounter = iterationsCounter;
    this.iterationsLimit = iterationsLimit;
    this.scene = scene;
    this.rectangle = rectangle;
    this.material = material;
    this.angle = angle;
    this.draw();
  }

  draw = () => {
    const r = Math.random() * 0.4 + 0.04;
    const p = MathUtils.degToRad(Math.random() * this.angle - this.angle/2);
    const e = MathUtils.degToRad(Math.random() * 360);

    const endPoint = new Vector3();
    endPoint.setFromSphericalCoords(r, p, e).add(this.startPoint);

    const path = new LineCurve3(this.startPoint, endPoint)
    const geometry = new TubeGeometry(path, 1, 0.003, 6, false);
    const mesh = new Mesh( geometry, this.material );
    this.scene.add(mesh);

    this.iterationsCounter += 1;
    if (this.iterationsCounter < this.iterationsLimit) {
      const b1 = new Branch(
        endPoint,
        this.iterationsCounter,
        this.iterationsLimit,
        this.scene,
        this.rectangle,
        this.material,
        this.angle
      );

      const b2 = new Branch(
        endPoint,
        this.iterationsCounter,
        this.iterationsLimit,
        this.scene,
        this.rectangle,
        this.material,
        this.angle
      );
    }
  }
}