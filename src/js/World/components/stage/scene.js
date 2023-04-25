import { Scene, Fog } from 'three';
import { hslToHex } from '../../utils/colorUtils';

const createScene = (hue) => {
  const scene = new Scene();
  scene.fog = new Fog( hslToHex(hue, 0.1, 0.8), 10, 30 );
  return scene;
}

export { createScene };