import { CanvasTexture, RepeatWrapping } from 'three';
import { floatBufferFromCanvas, normalMap as normalMapCreator } from "@thi.ng/pixel";
import { mapNumber } from './../../utils/numUtils';

export class TrainWindows {
	constructor(trainAcolor, windowsColor, repeatX = 1, repeatY = 1) {
    const width  = 512;
		const height = 128;


		let colorCanvas = document.createElement('canvas');
		colorCanvas.width = width;
		colorCanvas.height = height;
    let colorCanvasContext = colorCanvas.getContext( '2d' );
    colorCanvasContext.fillStyle = `rgb(${255*trainAcolor.r}, ${255*trainAcolor.g}, ${255*trainAcolor.b})`;
		colorCanvasContext.fillRect( 0, 0, width, height );

    const draw = (cc) => {
      const w = cc.width;
      const h = cc.height;
    
      const ccContext = cc.getContext("2d");
      ccContext.fillStyle = '#' + windowsColor.getHexString();

      const n = 12;
      const ym = 16;
      const xm = 16;
      const ww = (width)/n;

      for (let i = 0; i < n; i++) {
        const rx = xm + i * ww;
        const rw = ww/4;
        const ry = ym;
        const rh = (height - ym * 2) / 2 ;
        ccContext.fillRect(rx, ry, rw, rh);
      }
    }
    draw(colorCanvas);

    const colorMap  =  new CanvasTexture(colorCanvas);
    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.x = repeatX;
    colorMap.repeat.y = repeatY;
    colorCanvas = null;

		return {
      colorMap,
      // emissiveMap: colorMap
    };
	}
}