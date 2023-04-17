import { GUI } from 'dat.gui';
import { 
  AmbientLight,
  SpotLight,
  SpotLightHelper
} from 'three';
import { PerlinNoise } from '../canvasMaps/PerlinNoise';

const createLights = scene => {
  let map = new PerlinNoise();
  
  // mobile phone optimisation
  // setting lower mapSize makes it much faster on iPhone 12 Pro Max
  // const spot = new SpotLight(0xffffff, 840);

  const spot = new SpotLight(0xffffff, 5.0);
  spot.penumbra = 1;
  spot.decay = 0.8;
  spot.angle = Math.PI/5;
  spot.position.set(
    Math.random()*2 - 1,
    Math.random()*1 + 1,
    2
  );
  spot.castShadow = true;
  spot.map = map.colorMap;
  spot.shadow.focus = 1;
  spot.shadow.mapSize.width = 4096;
  spot.shadow.mapSize.height = 4096;
  scene.add(spot);
  map.colorMap = null;
  spot.target.position.set(0, 0.5, 0);
  spot.target.updateMatrixWorld();
  // scene.add(new SpotLightHelper(spot));

  const ambient = new AmbientLight(0x404040, 6.6); // soft white light
  scene.add(ambient);

  // const gui = new GUI();
  // gui.close()
  // gui.add(spot, 'intensity', 0.0, 20 );
  // gui.add(spot, 'penumbra', 0.0, 2 );
  // gui.add(spot, 'decay', 0.0, 4 );
  // gui.add(spot, 'angle', 0.0, 2 );
  // gui.add(ambient, 'intensity', 0.0, 20.0 );
}

export { createLights };