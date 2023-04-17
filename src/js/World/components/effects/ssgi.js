import * as POSTPROCESSING from "postprocessing"
import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"
import { SMAAEffect, SMAAPreset, EdgeDetectionMode, RenderPass } from "postprocessing";
import { SSGIDebugGUI } from '../../utils/SSGIDebugGUI';

const ssgi = (
  camera,
  scene,
  renderer
) => {
  
  const composer = new POSTPROCESSING.EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera));

  const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
  composer.addPass(velocityDepthNormalPass)

  const options = {
		distance: 0.33,
		thickness: 0.5,
		autoThickness: false,
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

  const ssgiEffect = new SSGIEffect(scene, camera, velocityDepthNormalPass, options)
  
  // const traaEffect = new TRAAEffect(scene, camera, velocityDepthNormalPass)
  const smaaEffect = new SMAAEffect();
  smaaEffect.preset = SMAAPreset.ULTRA;
  smaaEffect.edgeDetectionMode = EdgeDetectionMode.DEPTH;
  smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.05;
  const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass)
  const effectPass = new POSTPROCESSING.EffectPass(camera, ssgiEffect)
  const effectPass2 = new POSTPROCESSING.EffectPass(camera, smaaEffect, motionBlurEffect)
  composer.addPass(effectPass)
  composer.addPass(effectPass2)

  // const gui = new SSGIDebugGUI(ssgiEffect, options)
  return composer;
}

export { ssgi };