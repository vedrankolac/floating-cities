export class Resizer {
  constructor(camera, renderer) {
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.onResize();
    });
  }

  onResize() {}
}