import { SphereGeometry, Mesh, MeshStandardMaterial } from 'three';
import { hslToHex } from './colorUtils';

const lightTester = (scene, envMap) => {
  const radius = 0.33;
  const geometry = new SphereGeometry(radius, 64, 64);
  const spacingY = 0.8;
  const spacingZ = 0.6;
  const emi = 0.9;

  // black 0.04
  
  const colorA = hslToHex(0.6, 0, 0.04);
  const parametersA = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorA,
    roughness: 1,
    metalness: 0,
  } 
  const materialA = new MeshStandardMaterial(parametersA);

  const sphereMeshA = new Mesh( geometry, materialA );
  // sphereMeshA.castShadow = true;
  // sphereMeshA.receiveShadow = true;
  sphereMeshA.position.x = 0;
  sphereMeshA.position.y = spacingY;
  sphereMeshA.position.z = spacingZ * 0;
  scene.add(sphereMeshA);

  // gray 0.18
  
  const colorB = hslToHex(0.6, 0, 0.18);
  const parametersB = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorB,
    roughness: 1,
    metalness: 0,
  } 
  const materialB = new MeshStandardMaterial(parametersB);

  const sphereMeshB = new Mesh( geometry, materialB );
  // sphereMeshB.castShadow = true;
  // sphereMeshB.receiveShadow = true;
  sphereMeshB.position.x = 0;
  sphereMeshB.position.y = spacingY * 2;
  sphereMeshB.position.z = spacingZ * -1;
  scene.add(sphereMeshB);

  // white 0.85

  const colorC = hslToHex(0.6, 0, 0.85);
  const parametersC = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorC,
    roughness: 1,
    metalness: 0,
  } 
  const materialC = new MeshStandardMaterial(parametersC);

  const sphereMeshC = new Mesh( geometry, materialC );
  // sphereMeshC.castShadow = true;
  // sphereMeshC.receiveShadow = true;
  sphereMeshC.position.x = 0;
  sphereMeshC.position.y = spacingY * 3;
  sphereMeshC.position.z = spacingZ * -2;
  scene.add(sphereMeshC);

  // black 0.04
  
  const colorA2 = hslToHex(0.6, 0, 0.04);
  const parametersA2 = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorA2,
    roughness: 0,
    metalness: 0,
  } 
  const materialA2 = new MeshStandardMaterial(parametersA2);

  const sphereMeshA2 = new Mesh( geometry, materialA2 );
  // sphereMeshA.castShadow = true;
  // sphereMeshA.receiveShadow = true;
  sphereMeshA2.position.x = -1;
  sphereMeshA2.position.y = spacingY;
  sphereMeshA2.position.z = spacingZ * 0;
  scene.add(sphereMeshA2);

  // gray 0.18
  
  const colorB2 = hslToHex(0.6, 0, 0.18);
  const parametersB2 = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorB2,
    roughness: 0,
    metalness: 0,
  } 
  const materialB2 = new MeshStandardMaterial(parametersB2);

  const sphereMeshB2 = new Mesh( geometry, materialB2 );
  // sphereMeshB.castShadow = true;
  // sphereMeshB.receiveShadow = true;
  sphereMeshB2.position.x = -1;
  sphereMeshB2.position.y = spacingY * 2;
  sphereMeshB2.position.z = spacingZ * -1;
  scene.add(sphereMeshB2);

  // white 0.85

  const colorC2 = hslToHex(0.6, 0, 0.85);
  const parametersC2 = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorC2,
    roughness: 0,
    metalness: 0,
  } 
  const materialC2 = new MeshStandardMaterial(parametersC2);

  const sphereMeshC2 = new Mesh( geometry, materialC2 );
  // sphereMeshC.castShadow = true;
  // sphereMeshC.receiveShadow = true;
  sphereMeshC2.position.x = -1;
  sphereMeshC2.position.y = spacingY * 3;
  sphereMeshC2.position.z = spacingZ * -2;
  scene.add(sphereMeshC2);

  // chrome

  const colorD = hslToHex(0.6, 0, 0.9);
  const parametersD = {
    envMap: envMap,
    envMapIntensity: emi,
    color: colorD,
    roughness: 0.0,
    metalness: 1,
  } 
  const materialD = new MeshStandardMaterial(parametersD);

  const sphereMeshD = new Mesh( geometry, materialD );
  // sphereMeshD.castShadow = true;
  // sphereMeshD.receiveShadow = true;
  sphereMeshD.position.x = 0;
  sphereMeshD.position.y = spacingY * 4;
  sphereMeshD.position.z = spacingZ * -3;
  scene.add(sphereMeshD);
}

export { lightTester };