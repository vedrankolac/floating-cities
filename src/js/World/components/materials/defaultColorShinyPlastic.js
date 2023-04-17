import {
  MeshStandardMaterial
} from 'three';

const defaultColorShinyPlastic = (color, envMapIntensity = 1, envMap = null) => {
  const parameters = {
    envMap: envMap,
    envMapIntensity: envMapIntensity,
    color: color,
    roughness: 0,
    metalness: 0,
  } 
  const material = new MeshStandardMaterial(parameters);
  return material;
}

export {
  defaultColorShinyPlastic
};