import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";
import { Rectangle } from "../../utils/Rectangle";

export class Tower {
  constructor(
    rectangle,
    hue,
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.rectangle = rectangle;
    this.hue = hue;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;
  }

  draw = (rectangle) => {
    const r = Math.random();
    let color;

    if (r < 0.12) {
      color = hslToHex(this.hue, 0.9, 0.2);
    } else if (r > 0.80){
      color = hslToHex(0, 0.0, 0.02);
    } else {
      color = hslToHex(0, 0.0, 0.5);
    }
    
    const material = canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02});
    const maxHeight = 3.2;
    const yDownShift = 1.2;
    const height = Math.random() * maxHeight + 0.04;

    const item = cube(
      material,
      {
        width:  rectangle.width() - 0.02,
        height: height,
        depth:  rectangle.height() - 0.02
      },
      {
        x: rectangle.center().x,
        y: height/2 - yDownShift,
        z: rectangle.center().y
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

  getRectangle = () => {
    return this.rectangle;
  }

  split = (depth, limit, baseArea) => {
    // console.log('Tower::split', depth, limit);

    if (depth === limit) {
      return
    }

    let tower_1;
    let tower_2;

    if (this.rectangle.width() > this.rectangle.height()) {
      const split_x = this.rectangle.x1 + Math.random() * this.rectangle.width();
      tower_1 = new Tower(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, split_x, this.rectangle.y2),
        this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Tower(
        new Rectangle(split_x, this.rectangle.y1, this.rectangle.x2, this.rectangle.y2),
        this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    } else {
      const split_y = this.rectangle.y1 + Math.random() * this.rectangle.height();
      tower_1 = new Tower(
        new Rectangle(this.rectangle.x1, this.rectangle.y1, this.rectangle.x2, split_y),
        this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
      tower_2 = new Tower(
        new Rectangle(this.rectangle.x1, split_y, this.rectangle.x2, this.rectangle.y2),
        this.hue, this.scene, this.loop, this.physicsWorld, this.envMap
      );
    }

    if (tower_1.rectangle.area() * 3 > baseArea) {
      tower_1.split(depth+1, limit, baseArea);
    } else {
      this.draw(tower_1.rectangle);
    }

    tower_2.split(depth+1, limit, baseArea);
  }
}