import { Clock, Quaternion, Vector2 } from 'three';
import { EventQueue } from '@dimforge/rapier3d-compat';
import { hslToHex } from '../utils/colorUtils';

class Loop {
  constructor(camera, scene, renderer, composer = null, stats, orbitControls, doPostprocessing, gravity, dt) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.stats = stats;
    this.orbitControls = orbitControls;
    this.bodies = []
    this.kinematicPositionBasedBodies = []
    this.noPhysicsUpdatables = [];
    this.clock = new Clock();
    this.physicsWorld = undefined;
    this.composer = composer;
    this.doPostprocessing = doPostprocessing;
    this.runPhysics = true;
    this.gravity = gravity;
    this.dt = dt;
    this.accumulator = 0;
    this.stepCounter = 0;
    this.engineInitStepDone = false;
    document.addEventListener('keypress', this.keypress);
    document.addEventListener('visibilitychange', e => this.handleVisibilityChange(e));
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const frameTime = this.clock.getDelta();

      if (this.runPhysics) this.tickPhysics(frameTime); // update physics engine
      this.tickThree(frameTime); // update pure threejs elements

      if ( this.stats !== undefined) {
        this.stats.update(); 
      }

      if (this.orbitControls) {
        this.orbitControls.update();
      }

      if (this.doPostprocessing) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  setPhysics(physicsWorld) {
    this.physicsWorld = physicsWorld;
  }

  keypress = (e) => {
    if (e.code === 'KeyR') {
      if (this.runPhysics === true) {
        this.clock.stop();
        this.runPhysics = false;
      } else {
        this.clock.start();
        this.runPhysics = true;
      }
    }

    if (e.code === 'KeyI') {
      console.log('info', this.renderer.info);
    }
  }

  handleVisibilityChange(e) {
    if (document.visibilityState === 'hidden') {
      this.clock.stop();
      this.stop();
    } else {
      this.clock.start();
      this.start();
    }
  }

  updateComposer = (composer) => {
    this.composer = composer;
  }

  prepareForCapture = () => {
    if (this.doPostprocessing) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  saveAsPng = () => {
    console.log('downloading...', this.stepCounter);

    const imgData = this.renderer.domElement.toDataURL();
    var img = new Image();
    img.src = imgData;

    const link = document.createElement('a');
    link.download = 'crash_' + fxhash + '.png';
    link.href = imgData;
    link.click();
    link.delete;
  }

  updatePhysicsObjects = () => {
    // update motor positions
    // for (const object of this.updatableBodies) {
    //   object.tick(this.dt);
    // }

    this.bodies.forEach(body => {
      if (body.mesh.name === 'trainZ') {
        const position = body.rigidBody.translation();
        if (body.rigidBody.translation().z > 20) {
          body.rigidBody.setTranslation({ x: position.x, y: position.y, z: -20 }, true);
          body.rigidBody.setLinvel({
            x: 0,
            y: 0,
            z: randomM0() * 6 + 8
          }, true);
        }
        if (body.rigidBody.translation().z < -20) {
          body.rigidBody.setTranslation({ x: position.x, y: position.y, z: 20 }, true);
          body.rigidBody.setLinvel({
            x: 0,
            y: 0,
            z: -randomM0() * 6 + 8
          }, true);
        }
      }
      if (body.mesh.name === 'trainX') {
        const position = body.rigidBody.translation();
        if (body.rigidBody.translation().x > 20) {
          body.rigidBody.setTranslation({ x: -20, y: position.y, z: position.z }, true);
          body.rigidBody.setLinvel({
            x: randomM0() * 6 + 8,
            y: 0,
            z: 0,
          }, true);
        }
        if (body.rigidBody.translation().x < -20) {
          body.rigidBody.setTranslation({ x: 20, y: position.y, z: position.z }, true);
          body.rigidBody.setLinvel({
            x: -randomM0() * 6 + 8,
            y: 0,
            z: 0,
          }, true);
        }
      }
    });

    if (!this.engineInitStepDone) {
      const preloader = document.getElementById("preloader");
      preloader.style.display = "none";
      preloader?.remove();
      this.engineInitStepDone = true;
    }

    // if (this.stepCounter <= 400) {
    //   if (this.stepCounter === 400) {
    //     // this.prepareForCapture();
    //     // this.saveAsPng();
    //     // location.reload();
    //     $fx.preview();
    //   }
    //   ++ this.stepCounter;
    // }
  }

  tickPhysics(frameTime) {
    if (this.physicsWorld && this.bodies.length > 0) {
      this.accumulator += frameTime;

      // accumulator architecture is implemented according to this article
      // https://gafferongames.com/post/fix_your_timestep/

      while (this.accumulator >= this.dt) {
        // before making step in engine, run all the code that deals with updates to ensure we have a deterministic simulation
        this.updatePhysicsObjects();
        this.physicsWorld.step();
        this.accumulator -= this.dt;
      }

      // now update threejs items
      this.bodies.forEach(body => {
        const position = body.rigidBody.translation();
        const rotation = body.rigidBody.rotation();

        body.mesh.position.x = position.x;
        body.mesh.position.y = position.y;
        body.mesh.position.z = position.z;

        body.mesh.setRotationFromQuaternion(
          new Quaternion(
            rotation.x,
            rotation.y,
            rotation.z,
            rotation.w
          ));
      });
    }
  }

  tickThree(delta) {
    for (const object of this.noPhysicsUpdatables) {
      // console.log('object', object.name);
      const speedTranslation = 0.3;
      const speedRotation = 0.1;
      object.position.y += delta * object.speedTranslationY;
      object.rotation.x += delta * object.speedRotationX;
      object.rotation.y += delta * object.speedRotationY;
      object.rotation.z += delta * object.speedRotationZ;
      if (object.position.y > object.maxY) {
        object.position.y = object.initY;
      }
    }
  }
}

export { Loop };
