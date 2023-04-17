import RAPIER from '@dimforge/rapier3d-compat'
import { World as RWorld } from '@dimforge/rapier3d-compat'
import { orbitControls } from './utils/orbitControls'
import { stats } from './utils/stats'
import { Vector3, PMREMGenerator, EquirectangularReflectionMapping } from "three"
import { Loop } from './system/Loop.js'
import { createRenderer } from './system/renderer.js'
import { createScene } from './components/stage/scene.js'
import { createCamera, createDolly } from './components/stage/camera.js'
import { createLights } from './components/stage/lights.js'
import { VrControls } from './system/VrControls.js'
import { createHandsPhysicsController } from "./system/handsPhysicsController.js"
import { room as roomPhysicsComposition } from './components/bodies/room.js'
import { walls } from './components/meshes/walls.js'
import { pendulum } from "./components/bodies/pendulum/pendulum.js"
import { spheres } from "./components/sceneFragments/spheres.js"
import { cubes } from "./components/sceneFragments/cubes.js"
import { pedestals } from './components/sceneFragments/pedestals'
import { colorComposer } from './components/bodies/pendulum/colorComposer.js'
import { RoomEnvironment } from './components/stage/RoomEnv'
import { setPrintTools } from './utils/setPrintTools'
import { postprocessing } from './components/effects/postprocessing'
import { materialTester } from './utils/materialTester'
import { lightTester } from './utils/lightTester'
import { Resizer } from './system/Resizer'
import { planetsConfig } from "./components/bodies/planetsConfig";

import { pachinko } from './components/bodies/pachinko'

class World {
  constructor() {
    console.log('fxhash:   ', fxhash);

    // this.planetsConfig = planetsConfig();
    // this.gravity = this.planetsConfig.gravity;
    this.gravity = Math.random() * 6 + 1.4;
    this.dt = 1/120;

    this.xrEnabled = false;
    this.postprocessingEnabled = true;
    this.printToolsEnabled = true;
    this.ppM = {
      ssao: 'SSAO',
      ssgi: 'SSGI'
    }
    this.ppMA = this.ppM.ssao;

    this.colorComposition = colorComposer();
    this.bgColor = this.colorComposition.bg.color;
    this.bgHSL = {};
    this.bgColor.getHSL(this.bgHSL);

    this.renderer = createRenderer(this.postprocessingEnabled, this.xrEnabled);
    this.scene    = createScene();
    this.camera   = createCamera();
    this.lights   = createLights(this.scene);

    this.stats = stats(true);
    this.orbitControls = orbitControls(this.camera, this.renderer.domElement);
    this.composer = this.postprocessingEnabled ? postprocessing(this.camera, this.scene, this.renderer, this.ppMA) : null;
    this.loop = new Loop(this.camera, this.scene, this.renderer, this.composer, this.stats, this.orbitControls, this.postprocessingEnabled, this.gravity, this.dt);

    this.dolly = createDolly(this.camera, this.scene);
    this.vrControls = this.xrEnabled ? new VrControls(this.renderer, this.dolly, this.camera) : null;
    this.xrEnabled ? this.loop.updatableBodies.push(this.vrControls) : null;

    this.floorSize = 300;
    this.printTools = this.printToolsEnabled ? setPrintTools(this.renderer, this.composer, this.postprocessingEnabled, this.scene, this.camera) : null;

    this.resizer = new Resizer(this.camera, this.renderer);
    this.resizer.onResize = () => {
      this.composer = this.postprocessingEnabled ? postprocessing(this.camera, this.scene, this.renderer, this.ppMA) : null;
      this.loop.updateComposer(this.composer);
    };

    $fx.features({
      'Background Color': this.colorComposition.bg.name,
      'Color Palette': this.colorComposition.name,
    });
    
    RAPIER.init().then(() => {
      this.physicsConfig();
      this.buildScene();
    });
  }

  physicsConfig() {
    const engineGravity = new Vector3(0.0, -this.gravity, 0.0);
    this.physicsWorld = new RWorld(engineGravity);
    this.physicsWorld.timestep = this.dt;
    this.loop.setPhysics(this.physicsWorld);
    this.room = roomPhysicsComposition(this.physicsWorld, this.floorSize, false);
    this.handsPhysicsController = this.xrEnabled ? createHandsPhysicsController(this.scene, this.loop, this.physicsWorld, this.vrControls) : null;
  }

  buildScene() {
    const pmremGenerator = new PMREMGenerator(this.renderer);
    const envMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.001).texture;

    // envMap.mapping = EquirectangularReflectionMapping;
    // this.scene.environment = envMap;
    // this.scene.background = this.bgColor;

    // this.materialTester      = materialTester(this.scene, envMap);
    // this.lightTester         = lightTester(this.scene, envMap);


    this.pachinko = pachinko(this.scene, this.loop, this.physicsWorld, envMap, this.colorComposition)
    
    this.walls               = walls    (this.scene, this.floorSize, this.bgHSL, this.bgColor);
    // this.pendulum            = pendulum (this.scene, this.loop, this.physicsWorld, envMap, this.colorComposition, this.gravity);
    // this.spheresFragment     = spheres  (this.scene, this.loop, this.physicsWorld, envMap, this.bgHSL, {min: 0.02,  sizeRange: $fx.rand()/20, n: 8, y: 0.2, yRange: 3});
    // this.cubesFragment       = cubes    (this.scene, this.loop, this.physicsWorld, envMap, this.bgHSL, {min: 0.05,  sizeRange: 0.10, n: 10 , y: 0.2,  yRange: 2});
    // this.miniCubesFragment   = cubes    (this.scene, this.loop, this.physicsWorld, envMap, this.bgHSL, {min: 0.006, sizeRange: 0.04, n: 48, y: 0.06, yRange: 2});
    // this.pedestals           = pedestals(this.scene, this.loop, this.physicsWorld, envMap, this.colorComposition, {min: 0.006, sizeRange: 0.04, n: 48, y: 0.06, yRange: 2});
    
    // this.orbitControls.target = this.pendulum.handleB.mesh.position;
    this.orbitControls.target = this.pachinko.position;
  }

  start() {
    const preloaderText = document.getElementById("preloader-text");
    preloaderText.innerText="•";
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { World };