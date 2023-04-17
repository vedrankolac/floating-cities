import { CanvasTexture, RepeatWrapping } from 'three';
import { floatBufferFromCanvas, normalMap as normalMapCreator } from "@thi.ng/pixel";
import { mapNumber } from './../../utils/numUtils';

class RndNoiseTresholdNormal {
	constructor(color, colorNoiselevel = 0.55, normalNoiselevel = 0.7) {
    const width  = 1024;
		const height = 1024;

    // console.log('colorNoise', colorNoiselevel, 'normalNoise', normalNoiselevel);

		let colorCanvas = document.createElement('canvas');
		colorCanvas.width = width;
		colorCanvas.height = height;
    let colorCanvasContext = colorCanvas.getContext( '2d' );
    colorCanvasContext.fillStyle = `rgb(${255*color.r}, ${255*color.g}, ${255*color.b})`;
		colorCanvasContext.fillRect( 0, 0, width, height );

    let normalCanvas = document.createElement('canvas');
		normalCanvas.width = width;
		normalCanvas.height = height;
    let normalCanvasContext = normalCanvas.getContext( '2d' );
    normalCanvasContext.fillStyle = 'rgb(255,255,255)';
		normalCanvasContext.fillRect( 0, 0, width, height );

    const compositeNoise = (cc, nc, x = 0, y = 0, alpha = 255) => {
      const w = cc.width;
      const h = cc.height;
    
      const ccContext = cc.getContext("2d");      
      const ccImageData = ccContext.getImageData(x, y, w, h);
      const ccPixels = ccImageData.data;

      const ncContext = nc.getContext("2d");      
      const ncImageData = ncContext.getImageData(x, y, w, h);
      const ncPixels = ncImageData.data;

      const n = ccPixels.length;
      let i = 0;

      const darkSpotTreshold           = $fx.rand() * 0.04;
      const brightSpotTreshold         = $fx.rand() * 0.002;

      while (i < n) {
        let iN = i;

        // add background noise
        const rnd = $fx.rand()
        let noiseLevel  = 1 - (rnd * colorNoiselevel);
        let nNoiseLevel = 1 - (rnd * normalNoiselevel);

        // dark px
        let td = $fx.rand();
        const blackORGrayscale = Math.round($fx.rand());
        if (td < darkSpotTreshold) {
          // noiseLevel = blackORGrayscale ? $fx.rand() * 1 : 0;
          noiseLevel = $fx.rand() * 1;
          nNoiseLevel = 1 - $fx.rand() * 0.45;
        }

        let r = color.r * noiseLevel;
        let g = color.g * noiseLevel;
        let b = color.b * noiseLevel;

        // bright px
        const tb = $fx.rand();
        const whiteORGrayscale = Math.round($fx.rand());
        if (tb < brightSpotTreshold) {
          // noiseLevel = whiteORGrayscale ? $fx.rand() * 0.75 : 0.9;
          noiseLevel = $fx.rand() * 1;
          r = mapNumber(noiseLevel, 0, 1, color.r, 1);
          g = mapNumber(noiseLevel, 0, 1, color.g, 1);
          b = mapNumber(noiseLevel, 0, 1, color.b, 1);
        }

        ccPixels[i++] = r * 255;
        ccPixels[i++] = g * 255;
        ccPixels[i++] = b * 255;
        ccPixels[i++] = alpha;

        // normal map
        ncPixels[iN++] = ncPixels[iN++] = ncPixels[iN++] = nNoiseLevel * 255 | 0;
        ncPixels[iN++] = alpha;

      }

      ccContext.putImageData(ccImageData, x, y);
      ncContext.putImageData(ncImageData, x, y);
    }

    // make all noise maps in one loop
    compositeNoise(colorCanvas, normalCanvas);

    const normalMapSrc = floatBufferFromCanvas(normalCanvas);
    normalCanvas = null;
		let normalImage = normalMapCreator(normalMapSrc, {step: 0, scale: 1}).toImageData();

    const normalMap =  new CanvasTexture(normalImage);
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;
    normalImage = null;

    const colorMap  =  new CanvasTexture(colorCanvas);
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    colorCanvas = null;

		return {
			normalMap,
      colorMap
    };
	}
}

export { RndNoiseTresholdNormal };