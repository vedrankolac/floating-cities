import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";
import { Rectangle } from "../../utils/Rectangle";
import { BuildingFacade } from "../canvasMaps/BuildingFacade";
import {
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line
} from 'three';

export class Parcel {
  constructor(
    rectangle,
    density,
    hue,
    yDownShift,
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.rectangle = rectangle;
    this.density = density;
    this.hue = hue;
    this.yDownShift = yDownShift;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
    this.tree = false;
  }

  split = (depth, limit, baseArea) => {
    // console.log(' - split');

    if (depth === limit) {
      const tower = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower.draw();
      return;
    }

    let tower_1;
    let tower_2;

    // split on at least 10% of the length/width of the space
    const splitIndex = $fx.rand() * 0.7 + 0.15;

    if (this.rectangle.width() > this.rectangle.height()) {
      const split_x = this.rectangle.x1 + splitIndex * this.rectangle.width();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, split_x, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Parcel(
        new Rectangle(split_x, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    } else {
      const split_y = this.rectangle.y1 + splitIndex * this.rectangle.height();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, split_y),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Parcel(
        new Rectangle(this.rectangle.x1, split_y, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    }

    if (tower_1.rectangle.area() * this.density > baseArea) {
      tower_1.split(depth + 1, limit, baseArea);
    } else {
      tower_1.draw();
    }

    if (tower_2.rectangle.area() * this.density > baseArea) {
      tower_2.split(depth + 1, limit, baseArea);
    } else {
      tower_2.draw();
    }
  }

  getRectangle = () => {
    return this.rectangle;
  }

  draw = () => {
    const dIndex = $fx.rand();
    if (dIndex < 0.66) {
      this.drawTower();

      // if (dIndex < 0.1) {
      //   this.drawTree();
      // } else {
      //   this.drawTower();
      // }
    } else {
      // empty space
    }
  }

  drawTree = () => {
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
      let yCount = -this.yDownShift;

      for (let i = 0; i < 32; i++) {
        const point = new Vector3(
          this.rectangle.center().x + $fx.rand() * this.rectangle.width() - this.rectangle.width()/2,
          yCount,
          this.rectangle.center().y + $fx.rand() * this.rectangle.height() - this.rectangle.height()/2,
        )
        points.push(point);
        yCount += 0.02;
      }

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

  drawTower = () => {
    // console.log(' - draw');

    const cIndex = $fx.rand();
    let color;

    if (cIndex < 0.4) {
      // white or color
      color = ($fx.rand() > 0.5) ? hslToHex(0, 0.0, 0.5) : hslToHex(this.hue, 0.3, 0.4);
    } else if (cIndex > 0.80){
      // black
      color = hslToHex(0, 0.0, 0.02);
    } else {
      color = hslToHex(0, 0.0, $fx.rand()*0.6); // gray
    }

    const width = this.rectangle.width() - 0.02;
    const depth = this.rectangle.height() - 0.02;

    const maxHeight = 3.2;
    const hIndex = $fx.rand();
    const height = (hIndex>0.5)
      ? $fx.rand() * maxHeight + 0.04
      : width * Math.round($fx.rand() * 5);
    // const height = width * Math.round($fx.rand() * 5);
    
    //--

    let material = null;
    const txIndex = $fx.rand();
    if (txIndex > 0.5) {
      material = canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02});
    } else {
      const whRatio = height/width;
      const wdRatio = height/depth;

      const tI = Math.round(Math.random() * 8 + 4);
      // const tI = 12;
      // const mapsFrontBack = new BuildingFacade(color, tI, tI * whRatio);
      // const mapsLeftRight = new BuildingFacade(color, tI, tI * whRatio);
      const mapsFrontBack = null;
      const mapsLeftRight = null;

      material = [
        canvasTextureMaterial({ ...mapsLeftRight, envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}), // Right
        canvasTextureMaterial({ ...mapsLeftRight, envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}), // Left
        canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}), // Top
        canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}), // Bottom
        canvasTextureMaterial({ ...mapsFrontBack, envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}), // Front
        canvasTextureMaterial({ ...mapsFrontBack, envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02}) // Back
      ];
    }

    const item = cube(
      material,
      {
        width,
        height,
        depth
      },
      {
        x: this.rectangle.center().x,
        y: height/2 - this.yDownShift - Math.random()*(height/6),
        // y: height/2 - this.yDownShift ,
        z: this.rectangle.center().y
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