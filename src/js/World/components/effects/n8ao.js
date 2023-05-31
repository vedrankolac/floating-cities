import { GUI } from 'dat.gui';
import { SMAAEffect, SMAAPreset, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"
import { N8AOPostPass } from 'n8ao';

export const n8ao = (
  camera,
  scene,
  renderer,
  params
) => {
  const { motionBlur } = params;

  let clientWidth = window.innerWidth;
  let clientHeight = window.innerHeight;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const n8aopass = new N8AOPostPass(scene, camera, clientWidth, clientHeight);
  n8aopass.setQualityMode("Low");
  n8aopass.configuration.aoSamples = 4;
  n8aopass.configuration.denoiseSamples = 3;
  n8aopass.configuration.denoiseRadius = 20;
  n8aopass.configuration.aoRadius = 1;
  n8aopass.configuration.distanceFalloff = 0.6;
  n8aopass.configuration.intensity = 2.8;
  composer.addPass(n8aopass);

  const smaaEffect = new SMAAEffect({
		preset: SMAAPreset.MEDIUM,
	});
  const epSmaa = new EffectPass(camera, smaaEffect); 
  composer.addPass(epSmaa);

  let velocityDepthNormalPass = null;
  let motionBlurEffect = null;
  let epMotionBlur = null;
  if (motionBlur) {
    velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
    composer.addPass(velocityDepthNormalPass)
    motionBlurEffect = new MotionBlurEffect(
      velocityDepthNormalPass,
      {
        intensity: 1,
        jitter: 1,
        samples: 4
      }
    );
    epMotionBlur = new EffectPass(camera, motionBlurEffect); 
    composer.addPass(epMotionBlur);
  }
  
  const nc = n8aopass.configuration;
  const gui = new GUI();
  gui.add(nc, "aoSamples", 1.0, 64.0, 1.0);
  gui.add(nc, "denoiseSamples", 1.0, 8.0, 1.0);
  gui.add(nc, "denoiseRadius", 0.0, 50.0, 0.01);
  gui.add(nc, "aoRadius", 1.0, 5.0, 0.01);
  gui.add(nc, "distanceFalloff", 0.0, 3.0, 0.01);
  gui.add(nc, "intensity", 0.0, 10.0, 0.01);
  // gui.add(nc, "renderMode", ["Combined", "AO", "No AO", "Split", "Split AO"]);
  
  return composer;
}