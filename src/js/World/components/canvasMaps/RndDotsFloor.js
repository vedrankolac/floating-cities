import { floatBufferFromCanvas, normalMap as normalMapCreator } from "@thi.ng/pixel";
import { CanvasTexture, RepeatWrapping } from 'three';
import { mapNumber } from '../../utils/numUtils';

class RndDotsFloor {
	constructor(bgHSL, color, normalNoiselevel) {
		const width  = 2048;
		const height = 2048;
		const normalWidth  = 2048;
		const normalHeight = 2048;

		let colorCanvas = document.createElement('canvas');
		colorCanvas.width = width;
		colorCanvas.height = height;
    let colorCanvasContext = colorCanvas.getContext( '2d' );
		colorCanvasContext.fillStyle = `rgb(${255*color.r}, ${255*color.g}, ${255*color.b})`;
		colorCanvasContext.fillRect( 0, 0, width, height );

		let normalCanvas = document.createElement('canvas');
		normalCanvas.width = normalWidth;
		normalCanvas.height = normalHeight;
    let normalCanvasContext = normalCanvas.getContext( '2d' );
    normalCanvasContext.fillStyle = 'rgb(255,255,255)';
		normalCanvasContext.fillRect( 0, 0, normalWidth, normalHeight );

    let roughnessCanvas = document.createElement('canvas');
		roughnessCanvas.width = width;
		roughnessCanvas.height = height;
		let roughnessCanvasContext = roughnessCanvas.getContext('2d');
    roughnessCanvasContext.fillStyle = 'rgb(255,255,255)';
		roughnessCanvasContext.fillRect( 0, 0, width, height );

    let metalnessCanvas = document.createElement('canvas');
		metalnessCanvas.width = width;
		metalnessCanvas.height = height;
		let metalnessCanvasContext = metalnessCanvas.getContext('2d');
    metalnessCanvasContext.fillStyle = 'rgb(0,0,0)';
		metalnessCanvasContext.fillRect( 0, 0, width, height );

		const randomNoiseWithLevel = (cc, nc, x = 0, y = 0, alpha = 255) => {
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

			const cnl = 0.35;
			const nnl = 0.5;

			const darkSpotTreshold           = $fx.rand() * 0.1;
    	const brightSpotTreshold         = $fx.rand() * 0.001;

			while (i < n) {
				let iN = i;
				
				// add background noise
        const rnd = $fx.rand()
        let noiseLevel  = 1 - (rnd * cnl);
        let nNoiseLevel = 1 - (rnd * nnl);

        // dark px
        let td = $fx.rand();
        const blackORGrayscale = Math.round($fx.rand());
        if (td < darkSpotTreshold) {
          // noiseLevel = blackORGrayscale ? $fx.rand() * 1 : 0;
          noiseLevel = $fx.rand() * 1;
          nNoiseLevel = $fx.rand() * 0.4;
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

				ncPixels[iN++] = ncPixels[iN++] = ncPixels[iN++] = nNoiseLevel * 255;
				ncPixels[iN++] = alpha;
			}
			
			ccContext.putImageData(ccImageData, x, y);
      ncContext.putImageData(ncImageData, x, y);
		}

		randomNoiseWithLevel(colorCanvas, normalCanvas);


		const spread = mapNumber(bgHSL.l, 0, 1, 12, 400);
		const start  = mapNumber(bgHSL.l, 0, 1, 12, 100);
		const n = $fx.rand() * spread + start;

		for ( let i = 0; i < n; i ++ ) {
			const x = $fx.rand() * width;
			const y = $fx.rand() * height;
			const r = $fx.rand() * 3;
  
			const cRGB = $fx.rand() * mapNumber(bgHSL.l, 0, 1, 255, 0);

      colorCanvasContext.fillStyle = `rgb(${cRGB}, ${cRGB}, ${cRGB})`;
			colorCanvasContext.beginPath();
			colorCanvasContext.arc( x, y, r, 0, Math.PI * 2 );
			colorCanvasContext.fill();
			
			const rRGB = $fx.rand() * 224 + 32;
      roughnessCanvasContext.fillStyle = `rgb(${rRGB}, ${rRGB}, ${rRGB})`;
			roughnessCanvasContext.beginPath();
			roughnessCanvasContext.arc( x, y, r, 0, Math.PI * 2 );
			roughnessCanvasContext.fill();

			const mRGB = 0;
      metalnessCanvasContext.fillStyle = `rgb(${mRGB}, ${mRGB}, ${mRGB})`;
			metalnessCanvasContext.beginPath();
			metalnessCanvasContext.arc( x, y, r, 0, Math.PI * 2 );
			metalnessCanvasContext.fill();
		}

		const normalMapSrc = floatBufferFromCanvas(normalCanvas);
		normalCanvas = null;
		let normalImage = normalMapCreator(normalMapSrc, {step: 3, scale: 3}).toImageData();

		const repeatX = 8 * 15;
    const repeatY = 8 * 15;

		const normalMap =  new CanvasTexture(normalImage);
		normalMap.repeat.x = repeatX;
    normalMap.repeat.y = repeatY;
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;
		normalImage = null;

		const colorMap  =  new CanvasTexture(colorCanvas);
		colorMap.repeat.x = repeatX;
    colorMap.repeat.y = repeatY;
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
		colorCanvas = null;

		const roughnessMap  =  new CanvasTexture(roughnessCanvas);
		roughnessMap.repeat.x = repeatX;
    roughnessMap.repeat.y = repeatY;
    roughnessMap.wrapS = RepeatWrapping;
    roughnessMap.wrapT = RepeatWrapping;
		roughnessCanvas = null;

		const metalnessMap  =  new CanvasTexture(metalnessCanvas);
		metalnessMap.repeat.x = repeatX;
    metalnessMap.repeat.y = repeatY;
    metalnessMap.wrapS = RepeatWrapping;
    metalnessMap.wrapT = RepeatWrapping;
		metalnessCanvas = null;

		return {
      colorMap,
      roughnessMap,
      metalnessMap,
			normalMap
    };
	}
}

export { RndDotsFloor };