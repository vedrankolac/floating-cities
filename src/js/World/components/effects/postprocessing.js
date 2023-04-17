import { ssao } from "./ssao";
import { ssgi } from "./ssgi";

export const postprocessing = (
  camera,
  scene,
  renderer,
  method
) => {
  let composer = null;
  if (method == 'SSAO') {
    composer = ssao(camera, scene, renderer);
  }
  if (method == 'SSGI') {
    composer = ssgi(camera, scene, renderer);
  }
  return composer;
}