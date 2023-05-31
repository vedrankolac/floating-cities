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
    
    this.branches = [];
    this.create();
  }

  create = () => {
    let yInit = -this.yDownShift;

    const startPoint = new Vector3(
      this.rectangle.center().x,
      yInit,
      this.rectangle.center().y,
    );

    const color = hslToHex(0.0, 0.0, 0.0);
    this.material = canvasTextureMaterial({ envMap: null }, { color: color, roughness: 0, metalness: 0.0}, 0.00);

    const b = new Branch(
      startPoint,
      0,
      this.iterationsLimit,
      this.scene,
      this.rectangle,
      this.material,
      this.angle,
      this.branches
    );

    this.branches.push(b);
  }

  destroy = () => {
    this.material.dispose();

    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      this.scene.remove(branch.mesh);
      branch.destroy(); 
    }
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
    angle,
    branches
  ) {
    this.startPoint = startPoint;
    this.iterationsCounter = iterationsCounter;
    this.iterationsLimit = iterationsLimit;
    this.scene = scene;
    this.rectangle = rectangle;
    this.material = material;
    this.angle = angle;
    this.branches = branches;
    this.create();
  }

  create = () => {
    const r = randomM3() * 0.4 + 0.04;
    const p = MathUtils.degToRad(randomM3() * this.angle - this.angle/2);
    const e = MathUtils.degToRad(randomM3() * 360);

    const endPoint = new Vector3();
    endPoint.setFromSphericalCoords(r, p, e).add(this.startPoint);

    this.path = new LineCurve3(this.startPoint, endPoint)
    this.geometry = new TubeGeometry(this.path, 1, 0.006, 6, false);
    this.mesh = new Mesh( this.geometry, this.material );
    this.scene.add(this.mesh);

    this.iterationsCounter += 1;
    if (this.iterationsCounter < this.iterationsLimit) {
      const b1 = new Branch(
        endPoint,
        this.iterationsCounter,
        this.iterationsLimit,
        this.scene,
        this.rectangle,
        this.material,
        this.angle,
        this.branches
      );

      const b2 = new Branch(
        endPoint,
        this.iterationsCounter,
        this.iterationsLimit,
        this.scene,
        this.rectangle,
        this.material,
        this.angle,
        this.branches
      );

      this.branches.push(b1);
      this.branches.push(b2);
    }
  }

  destroy = () => {
    this.geometry.dispose();
    this.scene.remove(this.mesh);
    this.mesh = null;
    this.geometry = null;
    this.path = null;
  }
}