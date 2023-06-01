import { GUI } from 'dat.gui';
import { 
  AmbientLight,
  SpotLight,
  SpotLightHelper
} from 'three';
import { PerlinNoise } from '../canvasMaps/PerlinNoise';

export const createLights = scene => {
  let map = new PerlinNoise();
  
  // mobile phone optimisation
  // setting lower mapSize makes it much faster on iPhone 12 Pro Max
  // const spot = new SpotLight(0xffffff, 840);

  const spot = new SpotLight(0xffffff, 24);
  spot.penumbra = 1;
  spot.decay = 0.8;
  spot.angle = Math.PI/1.6;
  // spot.position.set(
  //   Math.random() * 2 + 1,
  //   6,
  //   Math.random() * 2 + 1,
  // );
  spot.castShadow = true;
  spot.map = map.colorMap;
  spot.shadow.focus = 1;
  spot.shadow.mapSize.width = 4096;
  spot.shadow.mapSize.height = 4096;
  scene.add(spot);
  map.colorMap = null;
  spot.target.position.set(0, 0, 0);
  spot.target.updateMatrixWorld();
  // scene.add(new SpotLightHelper(spot));

  const ambient = new AmbientLight(0xffffff, 3.0); // soft white light
  scene.add(ambient);

  const showGui = false;

  if (showGui) {
    const gui = new GUI();
    // gui.close()
    gui.add(spot, 'intensity', 0.0, 100 );
    gui.add(spot, 'penumbra', 0.0, 2 );
    gui.add(spot, 'decay', 0.0, 2 );
    gui.add(spot, 'angle', 0.0, 2 );
    gui.add(ambient, 'intensity', 0.0, 20.0 );
  }

  return {
    spot
  }
}

export const rndPosSpot = spot => {
  spot.position.set(
    randomM0() * 2 + 1,
    6,
    randomM0() * 2 + 1,
  );
}