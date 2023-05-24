import { Scene, Fog } from 'three';
import { hslToHex } from '../../utils/colorUtils';

const createScene = () => {
  const scene = new Scene();
  return scene;
}

const setFog = (hue, scene) => {
  scene.fog = new Fog( hslToHex(hue, 0.1, 0.8), 7, 30 );
}

export {
  createScene,
  setFog
};