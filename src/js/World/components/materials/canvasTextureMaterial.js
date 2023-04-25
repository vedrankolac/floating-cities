import { Vector2, MeshPhysicalMaterial } from 'three';
// import { GUI } from 'dat.gui';

const canvasTextureMaterial = (
    maps,
    props = null,
    envMapIntensity = 1
  ) => {

  const envMap    = maps.envMap ? maps.envMap : null;
  const color     = props.color ? props.color : null;
  const roughness = props.roughness ? props.roughness : null;
  const metalness = props.metalness ? props.metalness : null;

  const parameters = {
    // STANDARD

    envMap: envMap,
    envMapIntensity: envMapIntensity,

    color: color,
    map: maps.colorMap ? maps.colorMap : null,

    roughness: roughness,
    roughnessMap: maps.roughnessMap ? maps.roughnessMap : null,

    normalMap: maps.normalMap ? maps.normalMap : null,
		normalScale: new Vector2(1, 1),

    // aoMap: aoMap,
    // aoMapIntensity:

    // bumpMap: bumpMap,
    // bumpScale:

    // emissive:
    emissiveMap: maps.emissiveMap ? maps.emissiveMap : null,

    // displacementMap
    // displacementScale
    // displacementBias

    metalness: metalness,
    metalnessMap: maps.metalnessMap ? maps.metalnessMap : null,

    // alphaMap: alphaMap,

    // PHYSICAL

    // clearcoat:
    // clearcoatMap: clearcoatMap,
    // clearcoatRoughness:
    // clearcoatRoughnessMap:
    // clearcoatNormalScale: 
    // clearcoatNormalMap:

    // reflectivity:
    // ior:

    // sheen:
    // sheenColor:
    // sheenRoughness:

    // transmission:
    // transmissionMap: transmissionMap,
    // attenuationDistance:
    // attenuationColor:

    // specularIntensity:
    // specularColor:
    // specularIntensityMap:
    // specularColorMap:

    // onBeforeCompile: obc
  } 

  const material = new MeshPhysicalMaterial(parameters);

  // const gui = new GUI();
  // const cubeFolder = gui.addFolder('Material');
  // cubeFolder.add(material, 'roughness', 0, 1);
  // cubeFolder.add(material, 'metalness', 0, 1);
  // cubeFolder.open();

  return material;
}

export {
  canvasTextureMaterial
};