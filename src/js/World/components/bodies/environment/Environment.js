import { PlaneGeometry, SphereGeometry, Mesh, MeshStandardMaterial, MathUtils, DoubleSide } from 'three';
import { hslToHex } from '../../../utils/colorUtils';

export class Environment {
  constructor(
    scene,
    hue,
    size
    ) {
      this.scene = scene;
      this.hue = hue;
      this.size = size;

      this.plastic = {
        roughness: 1,
        metalness: 0,
        n: 'plastic'
      }

      this.dome = {
        color: null,
        material: null,
        geometry: null,
        mesh: null,
      }
  }

  create = () => {
    this.dome.color = hslToHex(this.hue, 0.1, 0.6);
    this.dome.material = new MeshStandardMaterial({
      envMapIntensity: 0,
      side: DoubleSide,
      roughness: this.plastic.roughness,
      metalness: this.plastic.metalness,
      color: this.dome.color
    });
    this.dome.geometry = new SphereGeometry(this.size/2, 64, 64);
    this.dome.mesh = new Mesh(this.dome.geometry, this.dome.material);
    this.scene.add(this.dome.mesh);
  }

  destroy = () => {
    console.log('Environment::destroy');
    this.dome.geometry.dispose();
    this.dome.material.dispose();
    this.scene.remove(this.dome.mesh);

    this.dome.geometry = null;
    this.dome.material = null;
    this.dome.mesh = null;
    this.dome.color = null;
  }
}