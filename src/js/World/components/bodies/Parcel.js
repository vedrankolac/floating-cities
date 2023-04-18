import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";
import { Rectangle } from "../../utils/Rectangle";

export class Parcel {
  constructor(
    rectangle,
    density,
    hue,
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.rectangle = rectangle;
    this.density = density;
    this.hue = hue;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
  }

  split = (depth, limit, baseArea) => {
    // console.log(' - split');

    if (depth === limit) {
      const tower = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower.drawTower();
      return;
    }

    let tower_1;
    let tower_2;

    // split on at least 10% of the length/width of the space
    const splitIndex = $fx.rand() * 0.8 + 0.1;

    if (this.rectangle.width() > this.rectangle.height()) {
      const split_x = this.rectangle.x1 + splitIndex * this.rectangle.width();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, split_x, this.rectangle.y2),
        this.density, this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Parcel(
        new Rectangle(split_x, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    } else {
      const split_y = this.rectangle.y1 + splitIndex * this.rectangle.height();
      tower_1 = new Parcel(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, split_y),
        this.density, this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Parcel(
        new Rectangle(this.rectangle.x1, split_y, this.rectangle.x2, this.rectangle.y2),
        this.density, this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    }

    if (tower_1.rectangle.area() * this.density > baseArea) {
      tower_1.split(depth + 1, limit, baseArea);
    } else {
      tower_1.drawTower();
    }

    if (tower_2.rectangle.area() * this.density > baseArea) {
      tower_2.split(depth + 1, limit, baseArea);
    } else {
      tower_2.drawTower();
    }
  }

  getRectangle = () => {
    return this.rectangle;
  }

  drawTower = () => {
    // console.log(' - draw');
    const r = $fx.rand();
    let color;

    if (r < 0.2) {
      
      // color = hslToHex(this.hue, 0.9, 0.2); // color
      // white
      color = ($fx.rand() > 0.5) ? hslToHex(0, 0.0, 0.5) : hslToHex(this.hue, 0.3, 0.4);
    } else if (r > 0.80){
      // black
      color = hslToHex(0, 0.0, 0.02);
    } else {
      color = hslToHex(0, 0.0, $fx.rand()*0.6); // gray
    }
    
    const material = canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02});
    const maxHeight = 3.2;
    const yDownShift = 1.2;
    const height = $fx.rand() * maxHeight + 0.04;

    const item = cube(
      material,
      {
        width:  this.rectangle.width() - 0.02,
        height: height,
        depth:  this.rectangle.height() - 0.02
      },
      {
        x: this.rectangle.center().x,
        y: height/2 - yDownShift,
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