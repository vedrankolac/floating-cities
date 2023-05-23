import { ssao } from "./ssao";
import { n8ao } from "./n8ao";
import { ssgi } from "./ssgi";
import { ssaogi } from "./ssaogi";

export const postprocessing = (
  camera,
  scene,
  renderer,
  method
) => {
  let composer = null;
  if (method == 'SSAO') {
    composer = ssao(camera, scene, renderer, { motionBlur: true });
  }
  if (method == 'N8AO') {
    composer = n8ao(camera, scene, renderer, { motionBlur: true });
  }
  if (method == 'SSGI') {
    composer = ssgi(camera, scene, renderer);
  }
  if (method == 'SSAOGI') {
    composer = ssaogi(camera, scene, renderer);
  }
  return composer;
}