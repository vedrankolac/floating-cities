import { canvasTextureMaterial } from "../../materials/canvasTextureMaterial";
import { RndNoiseTresholdNormal } from "../../canvasMaps/RndNoiseMaps";

const materialListComposer = (
    handleComposition,
    envMap
  ) => {

  const materialCompositionID = $fx.rand();

  // ROUGHNESS & METALNESS

  const plastic = {
    roughness: 1,
    metalness: 0,
    n: 'plastic',
    normalRange: 0.65
  }
  const roughMetal = {
    roughness: 1,
    metalness: 1,
    n: 'roughMetal',
    normalRange: 0.55
  }
  const shinyPlastic = {
    roughness: 0.25,
    metalness: 0,
    n: 'shinyPlastic',
    normalRange: 0.25
  }
  const shinyMetal = {
    roughness: 0.2,
    metalness: 0.6,
    n: 'shinyMetal',
    normalRange: 0.2
  }

  const rmProprerties = [];
  rmProprerties.push(plastic);
  rmProprerties.push(roughMetal);
  rmProprerties.push(shinyPlastic);
  rmProprerties.push(shinyMetal);

  const rmTheme = () => {
    const ai = Math.round($fx.rand() * (rmProprerties.length - 1));
    const bi = Math.round($fx.rand() * (rmProprerties.length - 1));
    const ci = Math.round($fx.rand() * (rmProprerties.length - 1));
    const a = rmProprerties[ai];
    const b = rmProprerties[bi];
    const c = rmProprerties[ci];

    console.log('r & m:    ', a.n, b.n, c.n);
    return {a, b, c};
  }

  const rm = rmTheme();

  // DIFFUSE

  const themesDiffuse = [];

  const allNoise = () => {
    const a = RndNoiseTresholdNormal;
    const b = RndNoiseTresholdNormal;
    const c = RndNoiseTresholdNormal;

    return {
      a,
      b,
      c
    };
  }
  themesDiffuse.push(allNoise);

  const themeIndex = Math.round((themesDiffuse.length - 1) * materialCompositionID);
  // const themeIndex = 0;

  let maps = themesDiffuse[themeIndex]();
  // console.log('materials:', themesDiffuse[themeIndex].name);

  let mapsA = new maps.a(handleComposition.a.colorComposition.color, $fx.rand()*0.25, $fx.rand()*rm.a.normalRange);
  let mapsB = new maps.b(handleComposition.b.colorComposition.color, $fx.rand()*0.25, $fx.rand()*rm.a.normalRange);
  let mapsC = new maps.c(handleComposition.c.colorComposition.color, $fx.rand()*0.25, $fx.rand()*rm.a.normalRange);

  handleComposition.a.material = canvasTextureMaterial(
    {...mapsA, envMap},
    rm.a,
    handleComposition.a.colorComposition.envMapIntensity
  );

  handleComposition.b.material = canvasTextureMaterial(
    {...mapsB, envMap},
    rm.b,
    handleComposition.b.colorComposition.envMapIntensity
  );

  handleComposition.c.material = canvasTextureMaterial(
    {...mapsC, envMap},
    rm.c,
    handleComposition.c.colorComposition.envMapIntensity
  );

  let mapsAKeys = Object.keys(mapsA);
  mapsAKeys.forEach(k => mapsA[k] = null);
  
  let mapsBKeys = Object.keys(mapsB);
  mapsBKeys.forEach(k => mapsA[k] = null);
  
  let mapsCKeys = Object.keys(mapsC);
  mapsCKeys.forEach(k => mapsA[k] = null)
}

export { materialListComposer };