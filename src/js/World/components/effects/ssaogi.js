import { GUI } from 'dat.gui';
import { BlendFunction, NormalPass, SSAOEffect, SMAAEffect, SMAAPreset, EdgeDetectionMode, EffectComposer, EffectPass, RenderPass, PredicationMode } from "postprocessing";
import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"
import { SSGIDebugGUI } from '../../utils/SSGIDebugGUI';

export const ssaogi = (
  camera,
  scene,
  renderer
) => {
  console.log('ssaogi');
  const capabilities = renderer.capabilities;
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  
  const normalPass = new NormalPass(scene, camera);
  composer.addPass(normalPass);

  const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
  composer.addPass(velocityDepthNormalPass)

  const ssgiOptions = {
		distance: 1.2,
		thickness: 0.5,
		autoThickness: true,
		maxRoughness: 1,
		blend: 0.95,
		denoiseIterations: 4,
		denoiseKernel: 3,
		denoiseDiffuse: 25,
		denoiseSpecular: 25.5,
		depthPhi: 5,
		normalPhi: 28,
		roughnessPhi: 18.75,
		envBlur: 0.5,
		importanceSampling: false,
		directLightMultiplier: 1,
		steps: 20,
		refineSteps: 4,
		spp: 1,
		resolutionScale: 1,
		missedRays: false
	}

  const ssgiEffect = new SSGIEffect(scene, camera, velocityDepthNormalPass, ssgiOptions);

  // POSTPROCESS SMAA
	const smaaEffect = new SMAAEffect({
		preset: SMAAPreset.HIGH,
		edgeDetectionMode: EdgeDetectionMode.COLOR,
		predicationMode: PredicationMode.DEPTH
	});
	const edgeDetectionMaterial = smaaEffect.edgeDetectionMaterial; 
	edgeDetectionMaterial.edgeDetectionThreshold = 0.01; 
	edgeDetectionMaterial.predicationThreshold = 0.002; 
	edgeDetectionMaterial.predicationScale = 1;

  const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass);

  const ssaoEffect = new SSAOEffect(camera, normalPass.texture, {
    blendFunction: BlendFunction.MULTIPLY,
    distanceScaling: false,
    depthAwareUpsampling: false,
    samples: 16,
    rings: 3,
    worldDistanceThreshold: 7.3,
    worldDistanceFalloff: 22,
    worldProximityThreshold: 1.2,
		worldProximityFalloff: 1.2,
    luminanceInfluence: 0.18,
    minRadiusScale: 0.1,
    radius: 0.075,
    intensity: 8.0,
    bias: 0.0,
    fade: 0.24,
    color: null,
    resolutionScale: 1.0,
  });

  const effectPass_0 = new EffectPass(camera, smaaEffect, ssaoEffect);
  const effectPass_1 = new EffectPass(camera, ssgiEffect)
  const effectPass_2 = new EffectPass(camera, motionBlurEffect);

  composer.addPass(effectPass_0);
  composer.addPass(effectPass_1);
  composer.addPass(effectPass_2);

  const showGui = false;

  if (showGui) {
    const blendMode = ssaoEffect.blendMode;
    const uniforms = ssaoEffect.ssaoMaterial.uniforms;

    const params = {
      "distance": {
        "threshold": uniforms.distanceCutoff.value.x,
        "falloff": (uniforms.distanceCutoff.value.y -
          uniforms.distanceCutoff.value.x)
      },
      "proximity": {
        "threshold": uniforms.proximityCutoff.value.x,
        "falloff": (uniforms.proximityCutoff.value.y -
          uniforms.proximityCutoff.value.x)
      },
      "upsampling": {
        "enabled": ssaoEffect.defines.has("DEPTH_AWARE_UPSAMPLING"),
        "threshold": Number(ssaoEffect.defines.get("THRESHOLD"))
      },
      "distanceScaling": {
        "enabled": ssaoEffect.distanceScaling,
        "min scale": uniforms.minRadiusScale.value
      },
      "lum influence": ssaoEffect.uniforms.get("luminanceInfluence").value,
      "intensity": uniforms.intensity.value,
      "bias": uniforms.bias.value,
      "fade": uniforms.fade.value,

      "wDThreshold": ssaoEffect.ssaoMaterial.worldDistanceThreshold,
      "wDFalloff": ssaoEffect.ssaoMaterial.worldDistanceFalloff,
      "wPThreshold": ssaoEffect.ssaoMaterial.worldProximityThreshold,
      "wPFalloff": ssaoEffect.ssaoMaterial.worldProximityFalloff,

      // "render mode": RenderMode.DEFAULT,
      "resolution": ssaoEffect.resolution.scale,
      "color": 0x000000,
      "opacity": blendMode.opacity.value,
      "blend mode": blendMode.blendFunction
    };

    const gui = new GUI();
    gui.close();
    gui.add(ssaoEffect, 'intensity', 0.0, 20.0 );
    gui.add(ssaoEffect, "samples", 1, 32, 1);
    gui.add(ssaoEffect, "rings", 1, 16, 1);
    gui.add(ssaoEffect, "radius", 1e-6, 0.4, 0.001);
    gui.add(params, "bias", 0.0, 0.2, 0.001).onChange((value) => {uniforms.bias.value = value;});
    gui.add(params, "fade", 0.0, 0.4, 0.001).onChange((value) => {uniforms.fade.value = value;});

    gui.add(params, "wDThreshold", 0.0, 20, 0.001).onChange((value) => {ssaoEffect.ssaoMaterial.worldDistanceThreshold = value;});
    gui.add(params, "wDFalloff", 0.0, 40, 0.001).onChange((value) => {ssaoEffect.ssaoMaterial.worldDistanceFalloff = value;});
    gui.add(params, "wPThreshold", 0.0, 4, 0.001).onChange((value) => {ssaoEffect.ssaoMaterial.worldProximityThreshold = value;});
    gui.add(params, "wPFalloff", 0.0, 4, 0.001).onChange((value) => {ssaoEffect.ssaoMaterial.worldProximityFalloff = value;});

    // gui.add(params, "lum influence", 0.0, 1.0, 0.001).onChange((value) => {
    //   ssaoEffect.uniforms.get("luminanceInfluence").value = value;
    // });

    // const f = gui.addFolder("Distance Cutoff");
    // f.add(params.distance, "threshold", 0.0, 1.0, 0.0001).onChange((value) => {
    //   ssaoEffect.setDistanceCutoff(value, params.distance.falloff);
    // });

    // f.add(params.distance, "falloff", 0.0, 1.0, 0.0001).onChange((value) => {
    //   ssaoEffect.setDistanceCutoff(params.distance.threshold, value);
    // });

    // const f2 = gui.addFolder("Proximity Cutoff");

    // f2.add(params.proximity, "threshold", 0.0, 0.01, 0.0001)
    //   .onChange((value) => {
    //     ssaoEffect.setProximityCutoff(value, params.proximity.falloff);
    //   });

    //   f2.add(params.proximity, "falloff", 0.0, 0.01, 0.0001).onChange((value) => {
    //   ssaoEffect.setProximityCutoff(params.proximity.threshold, value);
    // });

    // const f3 = gui.addFolder("Distance Scaling");
    // f3.add(params.distanceScaling, "enabled").onChange((value) => {
    //   ssaoEffect.distanceScaling = value;
    // });

    // f3.add(params.distanceScaling, "min scale", 0.0, 1.0, 0.001)
    //   .onChange((value) => {
    //     uniforms.minRadiusScale.value = value;
    //   });

    // if(capabilities.isWebGL2) {
    //   const f4 = gui.addFolder("Depth-Aware Upsampling");
    //   f4.add(params.upsampling, "enabled").onChange((value) => {
    //     ssaoEffect.depthAwareUpsampling = value;
    //   });

    //   f4.add(params.upsampling, "threshold", 0.0, 1.0, 0.001)
    //     .onChange((value) => {
    //       // Note: This threshold is not really supposed to be changed.
    //       ssaoEffect.defines.set("THRESHOLD", value.toFixed(3));
    //       effectPass.recompile();
    //     });
    // }
  }

  const gui = new SSGIDebugGUI(ssgiEffect, ssgiOptions)
  
  return composer;
}