import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";
import { TrainWindows } from "../canvasMaps/TrainWindows";

export class Train {
  constructor(
    roadWidth,
    xPos,
    zPos,
    yBase,
    orientation,
    hue,
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.roadWidth = roadWidth;
    this.xPos = xPos;
    this.zPos = zPos;
    this.yBase = yBase;
    this.orientation = orientation;
    this.hue = hue;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;

    this.makeTrack();
    this.makeTrains();
  }

  makeTrack = () => {
    const roadColor = hslToHex(0, 0.0, $fx.rand()*0.1 + 0.02);
    const roadMaterial = canvasTextureMaterial({ envMap: this.envMap }, { color: roadColor, roughness: 0.6, metalness: 0.02});

    const roadWidth = this.roadWidth + 0.02;
    const roadHeight = 0.01;
    const roadLength = $fx.rand() * 1 + 3;

    let size;
    let translation;
    const rotation = {
      x: 0,
      y: 0,
      z: 0
    };

    if (this.orientation === 'z') {
      size = {
        width:  roadWidth,
        height: roadHeight,
        depth:  roadLength
      }
      translation = {
        x: this.xPos,
        y: -this.yBase,
        z: 0
      }
    } else if (this.orientation === 'x') {
      size = {
        width:  roadLength,
        height: roadHeight,
        depth:  roadWidth
      }
      translation = {
        x: this.xPos,
        y: -this.yBase,
        z: this.zPos
      }
    }

    const road = cube(
      roadMaterial,
      size,
      translation,
      rotation,
      'none',
      this.physicsWorld
    );
    this.scene.add(road.mesh);
    // this.loop.bodies.push(road);
  }

  makeTrains = () => {
    const trainColor = hslToHex(0, 0.0, $fx.rand()*0.08 + 0.02); // gray
    const windowsColor = hslToHex(this.hue, 0.1, 0.00);
    const maps = new TrainWindows(trainColor, windowsColor);
    // const maps = null;

    let trainName;
    if (this.orientation === 'z') {
      trainName = 'trainZ';
    } else if (this.orientation === 'x') {
      trainName = 'trainX';
    }

    let trainMaterial;

    if (this.orientation === 'z') {
      trainMaterial = [
        canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02})
      ];
    } else if (this.orientation === 'x') {
      trainMaterial = [
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02}),
        canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02})
      ];
    }

    const trainWidth = 0.06;
    const trainHeight = 0.08;
    const trainLength = 0.56;

    let size;
    let translation;
    const rotation = {
      x: 0,
      y: 0,
      z: 0
    };

    // -- A

    if (this.orientation === 'z') {
      size = {
        width:  trainWidth,
        height: trainHeight,
        depth:  trainLength
      }
      translation = {
        x: this.xPos - trainWidth/2 - 0.01,
        y: -this.yBase + trainHeight/2 + 0.02,
        z: $fx.rand() * 30 - 15
      }
    } else if (this.orientation === 'x') {
      size = {
        width:  trainLength,
        height: trainHeight,
        depth:  trainWidth
      }
      translation = {
        x: $fx.rand() * 30 - 15,
        y: -this.yBase + trainHeight/2 + 0.02,
        z: this.zPos - trainWidth/2 - 0.01
      }
    }

    const trainA = cube(
      trainMaterial,
      size,
      translation,
      rotation,
      'dynamic',
      this.physicsWorld,
      trainName
    );
    this.scene.add(trainA.mesh);
    this.loop.bodies.push(trainA);

    // -- B

    if (this.orientation === 'z') {
      size = {
        width:  trainWidth,
        height: trainHeight,
        depth:  trainLength
      }
      translation = {
        x: this.xPos + trainWidth/2 + 0.01,
        y: -this.yBase + trainHeight/2 + 0.02,
        z: $fx.rand() * 30 - 15
      }
    } else if (this.orientation === 'x') {
      size = {
        width:  trainLength,
        height: trainHeight,
        depth:  trainWidth
      }
      translation = {
        x: $fx.rand() * 30 - 15,
        y: -this.yBase + trainHeight/2 + 0.02,
        z: this.zPos + trainWidth/2 + 0.01,
      }
    }

    const trainB = cube(
      trainMaterial,
      size,
      translation,
      rotation,
      'dynamic',
      this.physicsWorld,
      trainName
    );
    this.scene.add(trainB.mesh);
    this.loop.bodies.push(trainB);

    // -- velocity

    const velocityA = $fx.rand() * 6 + 8;
    const velocityB = $fx.rand() * 6 + 8;

    if (this.orientation === 'z') {
      trainB.rigidBody.setLinvel({
        x: 0,
        y: 0,
        z: velocityA * (($fx.rand() > 0.5) ? 1 : -1)
      }, true);
      trainA.rigidBody.setLinvel({
        x: 0,
        y: 0,
        z: velocityB * (($fx.rand() > 0.5) ? 1 : -1)
      }, true);
    } else if (this.orientation === 'x') {
      trainB.rigidBody.setLinvel({
        x: velocityA * (($fx.rand() > 0.5) ? 1 : -1),
        y: 0,
        z: 0
      }, true);
      trainA.rigidBody.setLinvel({
        x: velocityB * (($fx.rand() > 0.5) ? 1 : -1),
        y: 0,
        z: 0
      }, true);
    }
  }
}