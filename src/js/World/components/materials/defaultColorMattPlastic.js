import {
  MeshStandardMaterial
} from 'three';

const defaultColorMattPlastic = (color, envMapIntensity = 1, envmap = { texture: null }) => {
  const parameters = {
    envMap: envmap.texture,
    envMapIntensity: envMapIntensity,
    color: color,
    roughness: 1,
    metalness: 0,
  } 
  const material = new MeshStandardMaterial(parameters);
  return material;
}

export {
  defaultColorMattPlastic
};