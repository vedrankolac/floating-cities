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
  smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.01;

  const ssaoEffect = new SSAOEffect(camera, normalPass.texture, {
    blendFunction: BlendFunction.MULTIPLY,
    distanceScaling: false,
    depthAwareUpsampling: false,
    normalDepthBuffer,
    samples: 16,
    rings: 3,
    worldDistanceThreshold: 120,
    worldDistanceFalloff: 20,
    luminanceInfluence: 0.18,
    minRadiusScale: 0.1,
    radius: 0.04,
    intensity: 10.0,
    bias: 0.01,
    fade: 0.2,
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
    gui.add(params, "fade", 0.0, 0.2, 0.001).onChange((value) => {uniforms.fade.value = value;});
    gui.add(params, "lum influence", 0.0, 1.0, 0.001).onChange((value) => {
      ssaoEffect.uniforms.get("luminanceInfluence").value = value;
    });

    const f = gui.addFolder("Distance Cutoff");
    f.add(params.distance, "threshold", 0.0, 1.0, 0.0001).onChange((value) => {
      ssaoEffect.setDistanceCutoff(value, params.distance.falloff);
    });

    f.add(params.distance, "falloff", 0.0, 1.0, 0.0001).onChange((value) => {
      ssaoEffect.setDistanceCutoff(params.distance.threshold, value);
    });

    const f2 = gui.addFolder("Proximity Cutoff");

    f2.add(params.proximity, "threshold", 0.0, 0.01, 0.0001)
      .onChange((value) => {
        ssaoEffect.setProximityCutoff(value, params.proximity.falloff);
      });

      f2.add(params.proximity, "falloff", 0.0, 0.01, 0.0001).onChange((value) => {
      ssaoEffect.setProximityCutoff(params.proximity.threshold, value);
    });

    const f3 = gui.addFolder("Distance Scaling");
    f3.add(params.distanceScaling, "enabled").onChange((value) => {
      ssaoEffect.distanceScaling = value;
    });

    f3.add(params.distanceScaling, "min scale", 0.0, 1.0, 0.001)
      .onChange((value) => {
        uniforms.minRadiusScale.value = value;
      });

    if(capabilities.isWebGL2) {
      const f4 = gui.addFolder("Depth-Aware Upsampling");
      f4.add(params.upsampling, "enabled").onChange((value) => {
        ssaoEffect.depthAwareUpsampling = value;
      });

      f4.add(params.upsampling, "threshold", 0.0, 1.0, 0.001)
        .onChange((value) => {
          // Note: This threshold is not really supposed to be changed.
          ssaoEffect.defines.set("THRESHOLD", value.toFixed(3));
          effectPass.recompile();
        });
    }
  }
  
  return composer;
}

export { ssao };