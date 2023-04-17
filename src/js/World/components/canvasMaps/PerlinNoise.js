import {
  CanvasTexture,
  RepeatWrapping,
  LinearFilter,
  sRGBEncoding
} from 'three';
import Perlin from 'pf-perlin';

class PerlinNoise {
	constructor() {
    const width  = 256;
		const height = 256;

		let perlinCanvas = document.createElement('canvas');
		perlinCanvas.width = width;
		perlinCanvas.height = height;
    let perlinCanvasContext = perlinCanvas.getContext('2d');
    // let perlinCanvasContext = perlinCanvas.getContext('2d');

    const perlin2D = new Perlin({
      dimensions: 2,
      seed: Math.round($fx.rand()),
      wavelength: 2,
      persistence: 0.1
    });
    const resolution = Math.round($fx.rand() * 32 + 32); // from 32 t0 64
    // console.log('perlin.r: ', resolution);
    const imageData = perlinCanvasContext.getImageData(0, 0, width, height);
    let dataIndex = 0;

    for (let row = 0; row < height; ++row) {
      for (let col = 0; col < width; ++col) {
        imageData.data[dataIndex++] = imageData.data[dataIndex++] = imageData.data[dataIndex++] = perlin2D.get([ row / resolution, col / resolution]) * 256 | 0;
        imageData.data[dataIndex++] = 256;
      }
    }
    perlinCanvasContext.putImageData(imageData, 0, 0)

    const perlinMap  =  new CanvasTexture(perlinCanvas);
    perlinMap.wrapS = RepeatWrapping;
    perlinMap.wrapT = RepeatWrapping;
    perlinMap.minFilter = LinearFilter;
    perlinMap.magFilter = LinearFilter;
    perlinMap.encoding = sRGBEncoding;
    perlinCanvas = null;

		return { colorMap: perlinMap };
	}
}

export { PerlinNoise };