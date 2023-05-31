import { Rectangle } from "../../utils/Rectangle";
import { TowerPlain } from "./TowerPlain";
import { TowerStackVertically } from "./TowerStackVertically";
import { TowerStackHorizontally } from "./TowerStackHorizontally";
import { Tree } from "./Tree";

export class Parcel {
  constructor(
    rectangle,
    density,
    hue,
    yDownShift,
    scene,
    loop,
    physicsWorld,
    envMap,
    parcels
  ) {
    this.rectangle = rectangle;
    this.density = density;
    this.hue = hue;
    this.yDownShift = yDownShift;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
    this.parcels = parcels;
  }

  split = (depth, limit, baseArea) => {
    if (depth === limit) {
      const tower = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap, this.parcels
      );
      tower.draw();
      this.parcels.push(tower);
      return;
    }

    let tower_1;
    let tower_2;

    // split on at least 10% of the length/width of the space
    const splitIndex = randomM3() * 0.7 + 0.15;

    if (this.rectangle.width() > this.rectangle.height()) {
      const split_x = this.rectangle.x1 + splitIndex * this.rectangle.width();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, split_x, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap, this.parcels
      );
      tower_2 = new Parcel(
        new Rectangle(split_x, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap, this.parcels
      );
    } else {
      const split_y = this.rectangle.y1 + splitIndex * this.rectangle.height();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, split_y),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap, this.parcels
      );
      tower_2 = new Parcel(
        new Rectangle(this.rectangle.x1, split_y, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.yDownShift, this.scene, this.loop, this.physicsWorld, this.envMap, this.parcels
      );
    }

    this.parcels.push(tower_1);
    this.parcels.push(tower_2);

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
    // const maxHeight = 3.2;
    const maxHeight = m4 * 2.2 + 1;
    const hIndex = randomM4();
    let height = (hIndex>0.5)
      ? randomM4() * maxHeight + 0.04
      : this.rectangle.width() * Math.round(randomM4() * 5);
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

    this.building = null;

    // if small area and great hight - draw plain tower
    if ((height > maxHeight/3) && (this.rectangle.area() < 0.04)) {
      this.building = new TowerPlain(...tParams);
    } else {
      const dIndex = randomM3();
      if (dIndex < 0.45) {
        this.building = new TowerPlain(...tParams);
      } else if (dIndex >= 0.45 && dIndex < 0.6) {
        this.building = new TowerStackVertically(...tParams);
      } else if (dIndex >= 0.6 && dIndex < 0.7) {
        this.building = new TowerStackHorizontally(...tParams);
      } else if (dIndex >= 0.7 && dIndex < 1.0) {
        const tIndex = randomM3();
        if (this.rectangle.area() > 0.2) {
          if (tIndex > 0.1) this.building = new Tree(...tParams, randomM3()*30 + 30, 6);
        } else {
          if (tIndex > 0.6) this.building = new Tree(...tParams, randomM3()*10 + 20, 4);
        }
      }
    }
  }

  destroy = () => {
    console.log('Parcel::destroy');
    if (this.building) {
      this.building.destroy(); 
    }
  }
}