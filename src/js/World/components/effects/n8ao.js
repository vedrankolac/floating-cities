import { GUI } from 'dat.gui';
// import { BlendFunction, NormalPass, SSAOEffect, SMAAEffect, SMAAPreset, EdgeDetectionMode, EffectComposer, EffectPass, RenderPass, PredicationMode } from "postprocessing";
import { EffectPass, EffectComposer as EffectComposerPP, RenderPass, NormalPass } from "postprocessing";
import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"
import { N8AOPass } from 'n8ao';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

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
  const n8aopass = new N8AOPass(scene, camera, clientWidth, clientHeight);
  n8aopass.setQualityMode("Low");
  n8aopass.configuration.aoSamples = 4;
  n8aopass.configuration.denoiseSamples = 2;
  n8aopass.configuration.denoiseRadius = 20;
  n8aopass.configuration.aoRadius = 1;
  n8aopass.configuration.distanceFalloff = 0.6;
  n8aopass.configuration.intensity = 2.2;
  const smaaPass = new SMAAPass(clientWidth, clientHeight);
  composer.addPass(n8aopass);
  composer.addPass(smaaPass);

  // const composerPP = new EffectComposerPP(renderer);
  // composerPP.addPass(new RenderPass(scene, camera));
  // let velocityDepthNormalPass = null;
  // let motionBlurEffect = null;
  // let effectPass_2 = null;
  // if (motionBlur) {
  //   velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
  //   composerPP.addPass(velocityDepthNormalPass)
  //   motionBlurEffect = new MotionBlurEffect(
  //     velocityDepthNormalPass,
  //     {
  //       intensity: 1,
  //       jitter: 1,
  //       samples: 4
  //     }
  //   );
  //   effectPass_2 = new EffectPass(camera, motionBlurEffect); 
  //   // composerPP.addPass(effectPass_2);
  //   // composer.addPass(motionBlurEffect);
  // }
  // composer.addPass(effectPass_2);



  // const nc = n8aopass.configuration;
  // const gui = new GUI();
  // gui.add(nc, "aoSamples", 1.0, 64.0, 1.0);
  // gui.add(nc, "denoiseSamples", 1.0, 64.0, 1.0);
  // gui.add(nc, "denoiseRadius", 0.0, 50.0, 0.01);
  // gui.add(nc, "aoRadius", 1.0, 5.0, 0.01);
  // gui.add(nc, "distanceFalloff", 0.0, 3.0, 0.01);
  // gui.add(nc, "intensity", 0.0, 10.0, 0.01);
  // gui.add(nc, "renderMode", ["Combined", "AO", "No AO", "Split", "Split AO"]);
  
  return composer;
}