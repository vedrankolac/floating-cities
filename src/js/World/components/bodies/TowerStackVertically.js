import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";

export class TowerStackVertically {
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
    const cIndex = $fx.rand();
    let color;

    if (cIndex < 0.4) {
      // color = ($fx.rand() > 0.5) ? hslToHex(0, 0.0, 0.5) : hslToHex(this.hue, 0.3, 0.4); // white or color
      color = ($fx.rand() > 0.5) ? hslToHex(0, 0.0, 0.5) : hslToHex(0, 0.0, $fx.rand()*0.6); // white or gray
    } else if (cIndex > 0.80){
      // black
      color = hslToHex(0, 0.0, 0.02);
    } else {
      color = hslToHex(0, 0.0, $fx.rand()*0.6); // gray
    }

    const width = this.rectangle.width() - 0.02;
    const depth = this.rectangle.height() - 0.02;

    const nBlocks = $fx.rand() * 12 + 20;
    const blockHeight = this.height/nBlocks;
    
    let material = canvasTextureMaterial({ envMap: this.envMap }, { color: color, roughness: 0.6, metalness: 0.02});

    // const blockHI = $fx.rand()*0.8 + 0.2;
    // const blockHI = $fx.rand()*0.5 + 0.1;
    const blockHI = 0.5;
    const initY = -this.yDownShift + blockHeight/2*blockHI - $fx.rand()*(this.height/6);

    for (let i = 0; i < nBlocks; i++) {
      const item = cube(
        material,
        {
          width,
          height: blockHeight * blockHI,
          depth
        },
        {
          x: this.rectangle.center().x,
          y: initY + i * blockHeight,
          z: this.rectangle.center().y
        },
        {
          x: 0,
          y: 0,
          z: 0
        },
        'none',
        this.physicsWorld
      );
  
      this.scene.add(item.mesh);
    }
  }
}