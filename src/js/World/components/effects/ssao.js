import { GUI } from 'dat.gui';
import { BlendFunction, NormalPass, SSAOEffect, SMAAEffect, SMAAPreset, EdgeDetectionMode, EffectComposer, EffectPass, RenderPass, TextureEffect, DepthDownsamplingPass } from "postprocessing";
import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"

const ssao = (
  camera,
  scene,
  renderer
) => {
  const capabilities = renderer.capabilities;
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  
  const normalPass = new NormalPass(scene, camera);
  const depthDownsamplingPass = new DepthDownsamplingPass({
    normalBuffer: normalPass.texture,
    resolutionScale: 1.0
  });

  const normalDepthBuffer = capabilities.isWebGL2 ? depthDownsamplingPass.texture : null;

  const smaaEffect = new SMAAEffect();
  smaaEffect.preset = SMAAPreset.ULTRA;
  smaaEffect.edgeDetectionMode = EdgeDetectionMode.DEPTH;
  smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.05;

  const ssaoEffect = new SSAOEffect(camera, normalPass.texture, {
    blendFunction: BlendFunction.MULTIPLY,
    // blendFunction: BlendFunction.NORMAL,
    distanceScaling: false,
    depthAwareUpsampling: false,
    normalDepthBuffer,
    samples: 16,
    rings: 3,
    worldDistanceThreshold: 35,
    worldDistanceFalloff: 10,
    luminanceInfluence: 0.6,
    minRadiusScale: 0.1,
    radius: 0.03,
    intensity: 5.8,
    bias: 0.03,
    // fade: 0.085,
    fade: 0.11,
    color: null,
    resolutionScale: 1.0,
  });

  const textureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: depthDownsamplingPass.texture
  });

  const effectPass = new EffectPass(camera, smaaEffect, ssaoEffect, textureEffect);
  composer.addPass(normalPass);

  if(capabilities.isWebGL2) {
    composer.addPass(depthDownsamplingPass);
  } else {
    console.log("WebGL 2 not supported, falling back to naive depth downsampling");
  }

  composer.addPass(effectPass);

  // const blendMode = ssaoEffect.blendMode;
  // const uniforms = ssaoEffect.ssaoMaterial.uniforms;

  // const params = {
  //   "distance": {
  //     "threshold": uniforms.distanceCutoff.value.x,
  //     "falloff": (uniforms.distanceCutoff.value.y -
  //       uniforms.distanceCutoff.value.x)
  //   },
  //   "proximity": {
  //     "threshold": uniforms.proximityCutoff.value.x,
  //     "falloff": (uniforms.proximityCutoff.value.y -
  //       uniforms.proximityCutoff.value.x)
  //   },
  //   "upsampling": {
  //     "enabled": ssaoEffect.defines.has("DEPTH_AWARE_UPSAMPLING"),
  //     "threshold": Number(ssaoEffect.defines.get("THRESHOLD"))
  //   },
  //   "distanceScaling": {
  //     "enabled": ssaoEffect.distanceScaling,
  //     "min scale": uniforms.minRadiusScale.value
  //   },
  //   "lum influence": ssaoEffect.uniforms.get("luminanceInfluence").value,
  //   "intensity": uniforms.intensity.value,
  //   "bias": uniforms.bias.value,
  //   "fade": uniforms.fade.value,
  //   // "render mode": RenderMode.DEFAULT,
  //   "resolution": ssaoEffect.resolution.scale,
  //   "color": 0x000000,
  //   "opacity": blendMode.opacity.value,
  //   "blend mode": blendMode.blendFunction
  // };

  // const gui = new GUI();
  // gui.close();
  // gui.add(ssaoEffect, 'intensity', 0.0, 20.0 );
  // gui.add(ssaoEffect, "samples", 1, 32, 1);
	// gui.add(ssaoEffect, "rings", 1, 16, 1);
	// gui.add(ssaoEffect, "radius", 1e-6, 1.0, 0.001);
  // gui.add(params, "bias", 0.0, 0.2, 0.001).onChange((value) => {uniforms.bias.value = value;});
  // gui.add(params, "fade", 0.0, 0.2, 0.001).onChange((value) => {uniforms.fade.value = value;});
  
  return composer;
}

export { ssao };