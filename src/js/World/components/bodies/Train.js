import { hslToHex } from "../../utils/colorUtils";
import { canvasTextureMaterial } from "../materials/canvasTextureMaterial";
import { cube } from "./cube";
import { TrainWindows } from "../canvasMaps/TrainWindows";

export class Train {
  constructor(
    roadWidth,
    split_x,
    b2,
    hue,
    scene,
    loop,
    physicsWorld,
    envMap
  ) {
    this.roadWidth = roadWidth;
    this.split_x = split_x;
    this.b2 = b2;
    this.hue = hue;
    this.scene = scene;
    this.loop = loop;
    this.physicsWorld = physicsWorld;
    this.envMap = envMap;

    this.trainWidth = 0.06;
    this.trainHeight = 0.14;
    this.trainLength = 0.56;

    this.makeTrack();
    this.makeTrains();
  }

  makeTrack = () => {
    const roadColor = hslToHex(0, 0.0, 0.02);
    const roadMaterial = canvasTextureMaterial({ envMap: this.envMap }, { color: roadColor, roughness: 0.6, metalness: 0.02});
    const road = cube(
      roadMaterial,
      {
        width:  this.roadWidth + 0.02,
        height: 0.01,
        depth:  4
      },
      {
        x: this.split_x,
        y: -this.b2,
        z: 0
      },
      {
        x: 0,
        y: 0,
        z: 0
      },
      this.physicsWorld,
      'fixed'
    );
    this.scene.add(road.mesh);
    this.loop.bodies.push(road);
  }

  makeTrains = () => {
    const trainColor = hslToHex(0, 0.0, $fx.rand()*0.3 + 0.02); // gray
    const windowsColor = hslToHex(this.hue, 0.1, 0.6);
    const maps = new TrainWindows(trainColor, windowsColor);
    
    const trainMaterial = [
      canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02}),
      canvasTextureMaterial({ ...maps, envMap: this.envMap }, { color: null, roughness: 0.6, metalness: 0.02}),
      canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
      canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
      canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02}),
      canvasTextureMaterial({ envMap: this.envMap }, { color: trainColor, roughness: 0.6, metalness: 0.02})
    ];

    const trainA = cube(
      trainMaterial,
      {
        width:  this.trainWidth,
        height: this.trainHeight,
        depth:  this.trainLength
      },
      {
        x: this.split_x - this.trainWidth/2 - 0.01,
        y: -this.b2 + this.trainHeight/2 + 0.02,
        z: $fx.rand()*30 - 15
      },
      {
        x: 0,
        y: 0,
        z: 0
      },
      this.physicsWorld,
      'dynamic',
      'train'
    );
    this.scene.add(trainA.mesh);
    this.loop.bodies.push(trainA);


    const trainB = cube(
      trainMaterial,
      {
        width:  this.trainWidth,
        height: this.trainHeight,
        depth:  this.trainLength
      },
      {
        x: this.split_x + this.trainWidth/2 + 0.01,
        y: -this.b2 + this.trainHeight/2 + 0.02,
        z: $fx.rand()*30 - 15
      },
      {
        x: 0,
        y: 0,
        z: 0
      },
      this.physicsWorld,
      'dynamic',
      'train'
    );
    this.scene.add(trainB.mesh);
    this.loop.bodies.push(trainB);

    // const velocity = $fx.rand()*10;
    const velocityA = $fx.rand()*50 + 4;
    const velocityB = $fx.rand()*50 + 4;

    trainB.rigidBody.setLinvel({
      x: 0,
      y: 0,
      z: velocityA
    }, true);

    trainA.rigidBody.setLinvel({
      x: 0,
      y: 0,
      z: velocityB
    }, true);
  }
}