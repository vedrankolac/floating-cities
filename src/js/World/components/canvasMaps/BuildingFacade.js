import { CanvasTexture, RepeatWrapping } from 'three';
import { floatBufferFromCanvas, normalMap as normalMapCreator } from "@thi.ng/pixel";
import { mapNumber } from './../../utils/numUtils';

export class BuildingFacade {
	constructor(color, repeatX = 1, repeatY = 1) {
    const width  = 64;
		const height = 64;

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
      ccContext.fillStyle = '#ffffff';
      const rx = 0;
      const ry = 0;
      // const rw = width - rx * 2;
      // const rh = width - ry * 2;

      const rw = width - rx * 2;
      const rh = 8;

      // const rw = 4;
      // const rh = width;

      ccContext.fillRect(rx, ry, rw, rh);

      const ncContext = nc.getContext("2d");
      ncContext.fillStyle = '#000000';
      ncContext.fillRect(rx, ry, rw, rh);
    }

    // make all noise maps in one loop
    compositeNoise(colorCanvas, normalCanvas);

    const normalMapSrc = floatBufferFromCanvas(normalCanvas);
    normalCanvas = null;
		let normalImage = normalMapCreator(normalMapSrc, {step: 3, scale: 8}).toImageData();

    const normalMap =  new CanvasTexture(normalImage);
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;
    normalImage = null;

    const colorMap  =  new CanvasTexture(colorCanvas);
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.x = repeatX;
    colorMap.repeat.y = repeatY;
    colorCanvas = null;

		return {
			// normalMap,
      colorMap
    };
	}
}