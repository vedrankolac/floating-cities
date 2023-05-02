import { Rectangle } from "../../utils/Rectangle";
import { TowerPlain } from "./TowerPlain";
import { TowerStackVertically } from "./TowerStackVertically";
import { TowerStackHorizontally } from "./TowerStackHorizontally";

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
    const maxHeight = 3.2;
    const hIndex = $fx.rand();
    let height = (hIndex>0.5)
      ? $fx.rand() * maxHeight + 0.04
      : this.rectangle.width() * Math.round($fx.rand() * 5);
    if (height > maxHeight) height = maxHeight;

    const tParams = [
      height,
      this.yDownShift,
      this.hue,
      this.rectangle,
      this.envMap,
      this.physicsWorld,
      this.scene
    ]

    let t = null;

    // if small area and great hight - draw plain tower
    if ((height > maxHeight/3) && (this.rectangle.area() < 0.04)) {
       t = new TowerPlain(...tParams);
    } else {
      const dIndex = $fx.rand();
      if (dIndex < 0.45) {
        t = new TowerPlain(...tParams);
      } else if (dIndex >= 0.45 && dIndex < 0.6) {
        t = new TowerStackVertically(...tParams);
      } else if (dIndex >= 0.6 && dIndex < 0.7) {
        t = new TowerStackHorizontally(...tParams);
      } else if (dIndex >= 0.7 && dIndex < 1.0) {
        // leave empty space
      }
    }
  }
}