import RAPIER from '@dimforge/rapier3d-compat'
import { World as RWorld } from '@dimforge/rapier3d-compat'
import { orbitControls } from './utils/orbitControls'
import { stats } from './utils/stats'
import { Vector3 } from "three"
import { Loop } from './system/Loop.js'
import { createRenderer } from './system/renderer.js'
import { createScene, setFog } from './components/stage/scene.js'
import { createCamera, createDolly, rndPosCamera } from './components/stage/camera.js'
import { createLights, rndPosSpot } from './components/stage/lights.js'
import { VrControls } from './system/VrControls.js'
import { createHandsPhysicsController } from "./system/handsPhysicsController.js"
import { room as roomPhysicsComposition } from './components/bodies/room.js'
import { Environment } from './components/bodies/environment/Environment'
import { createEnvMapFromScene } from './components/stage/createEnvMapFromScene'
import { setPrintTools } from './utils/setPrintTools'
import { postprocessing } from './components/effects/postprocessing'
import { materialTester } from './utils/materialTester'
import { lightTester } from './utils/lightTester'
import { Resizer } from './system/Resizer'
import { Structure } from './components/bodies/Structure.js';

class World {
  constructor() {
    console.log('');
    console.log('World');

    this.setAndRunThreejs();
    
    // function called from EditArt platform
    window.drawArt = () => {
      console.log('World::drawArt', this.physicsInitiated);

      if (this.physicsInitiated) {
        this.buildGame();
      } else {
        this.triedToCallDrawArtWithoutPhisycsInit = true;
        // will be called once when rapier is loaded and initiated
      }
    }
    
    // load Rapier WASM and init it
    RAPIER.init().then(() => {
      this.physicsConfig();
      if (this.triedToCallDrawArtWithoutPhisycsInit) {
        drawArt();
      }
    });

    // remove when making build version, should be called from EditArt platform
    drawArt();
  }

  setAndRunThreejs() {
    console.log('World::setAndRunThreejs');
    this.physicsInitiated = false;
    this.triedToCallDrawArtWithoutPhisycsInit = false;
    this.gravity = 0;
    this.dt = 1/120;
    this.floorSize = 600;

    this.xrEnabled = false;
    this.postprocessingEnabled = true;
    this.printToolsEnabled = true;

    this.renderer = createRenderer(this.postprocessingEnabled, this.xrEnabled);
    this.scene    = createScene();
    this.camera   = createCamera();
    this.lights   = createLights(this.scene);
    this.envMap   = createEnvMapFromScene(this.renderer);

    this.ppM = {
      ssao:   'SSAO',
      n8ao:   'N8AO',
      ssgi:   'SSGI',
      ssaogi: 'SSAOGI'
    }
    this.ppMA = this.ppM.n8ao;
    this.composer = this.postprocessingEnabled ? postprocessing(this.camera, this.scene, this.renderer, this.ppMA) : null;

    this.stats = stats(false);
    this.orbitControls = orbitControls(this.camera, this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer, this.composer, this.stats, this.orbitControls, this.postprocessingEnabled, this.gravity, this.dt);

    this.dolly = createDolly(this.camera, this.scene);
    this.vrControls = this.xrEnabled ? new VrControls(this.renderer, this.dolly, this.camera) : null;
    this.xrEnabled ? this.loop.updatableBodies.push(this.vrControls) : null;

    this.printTools = this.printToolsEnabled ? setPrintTools(this.renderer, this.composer, this.postprocessingEnabled, this.scene, this.camera) : null;

    this.resizer = new Resizer(this.camera, this.renderer);
    this.resizer.onResize = () => {
      this.composer = this.postprocessingEnabled ? postprocessing(this.camera, this.scene, this.renderer, this.ppMA) : null;
      this.loop.updateComposer(this.composer);
    };
  }

  physicsConfig() {
    console.log('World::physicsConfig');
    const engineGravity = new Vector3(0.0, -this.gravity, 0.0);
    this.physicsWorld = new RWorld(engineGravity);
    this.physicsWorld.timestep = this.dt;
    this.loop.setPhysics(this.physicsWorld);
    this.room = roomPhysicsComposition(this.physicsWorld, this.floorSize, false);
    this.handsPhysicsController = this.xrEnabled ? createHandsPhysicsController(this.scene, this.loop, this.physicsWorld, this.vrControls) : null;
    this.physicsInitiated = true;
  }

  buildGame() {
    console.log('World::buildGame');
    console.log('World::buildGame::params', m0, m1, m2, m3, m4);
    console.log('World::buildGame::rparams', randomM0(), randomM1(), randomM2(), randomM3(), randomM4());

    rndPosCamera(this.camera);
    rndPosSpot(this.lights.spot);

    this.hue = m2;
    console.log('World::buildGame::this.hue', this.hue);
    setFog(this.hue, this.scene);

    if (this.structure) {
      this.structure.destroy();
      this.structure.create(this.hue);
    } else {
      this.structure = new Structure(this.scene, this.loop, this.physicsWorld, this.envMap);
      this.structure.create(this.hue);
    }

    if (this.environment) {
      this.environment.destroy();
      this.environment.create(this.hue);
    } else {
      this.environment = new Environment(this.scene, this.floorSize);
      this.environment.create(this.hue);
    }

    // console.log('info', this.renderer.info);
    // this.structure.destroy();
    // console.log('info', this.renderer.info);
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