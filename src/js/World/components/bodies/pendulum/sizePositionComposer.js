import { mapNumber } from "../../../utils/numUtils";

const sizePositionComposer = () => {
  const sizeAndPositionID = $fx.rand();

  const minW = 0.3;
  const maxW  = 2.4;

  const minHD = 0.1;
  const maxHD = 0.6;

  const maxAspect = 1.5;
  const minAspect = 0.5;

  const minVolume = minW * minHD * minHD;
  const maxVolume = maxW * maxHD * maxHD * 0.4;
  const minVolumeAsFrac = ( maxW * maxHD * maxHD)/60;

  const centerWeighted = () => {
    console.log('size:      centerWeighted');
    const bVolumeIndex = sizeAndPositionID;
    const bVolume = mapNumber(bVolumeIndex, 0, 1, minVolumeAsFrac, maxVolume);
    const bW      = mapNumber(1, 0, 1, minW, maxW);
    const brd     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const brh = 1/brd;
    const bH = Math.pow(bVolume/bW * brh, 1/2);
    const bD = Math.pow(bVolume/bW * brd, 1/2);

    const aVolumeIndex = $fx.rand();
    const aVolumeMin = bVolume * mapNumber(bVolumeIndex, 0, 1, 1, Math.log(bVolumeIndex + 0.0001) + minVolumeAsFrac);
    const aVolumeMax = bVolume * mapNumber(bVolumeIndex, 0, 1, 4, 1)
    const aVolume = mapNumber(aVolumeIndex, 0, 1, aVolumeMin, aVolumeMax);
    const aW      = mapNumber($fx.rand(), 0, 1, minW, maxW);
    const ard     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const arh = 1/ard;
    const aH = Math.pow(aVolume/aW * arh, 1/2);
    const aD = Math.pow(aVolume/aW * ard, 1/2);

    const cVolumeIndex = $fx.rand();
    const cVolumeMin = bVolume * mapNumber(bVolumeIndex, 0, 1, 1, Math.log(bVolumeIndex + 0.0001) + minVolumeAsFrac);
    const cVolumeMax = bVolume * mapNumber(bVolumeIndex, 0, 1, 4, 1)
    const cVolume = mapNumber(cVolumeIndex, 0, 1, cVolumeMin, cVolumeMax);
    const cW      = mapNumber($fx.rand(), 0, 1, minW, maxW);
    const crd     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const crh = 1/crd;
    const cH = Math.pow(cVolume/cW * crh, 1/2);
    const cD = Math.pow(cVolume/cW * crd, 1/2);

    const size = {
      a: {
        width:  aW,
        height: aH,
        depth:  aD
      },
      b: {
        width:  bW,
        height: bH,
        depth:  bD
      },
      c: {
        width:  cW,
        height: cH,
        depth:  cD
      }
    }

    const volume = {
      a: aVolume/maxVolume,
      b: bVolume/maxVolume,
      c: cVolume/maxVolume
    }

    return {
      size,
      volume
    }
  }

  const sideWeighted = () => {
    console.log('size:      sideWeighted');
    const aVolumeIndex = sizeAndPositionID;
    const aVolume = mapNumber(aVolumeIndex, 0, 1, minVolumeAsFrac, maxVolume);
    const aW      = mapNumber($fx.rand(), 0, 1, minW, maxW);
    const ard     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const arh = 1/ard;
    const aH = Math.pow(aVolume/aW * arh, 1/2);
    const aD = Math.pow(aVolume/aW * ard, 1/2);

    const bVolumeIndex = $fx.rand();
    const bVolumeMin = aVolume * mapNumber(aVolumeIndex, 0, 1, 1, Math.log(aVolumeIndex*1.03 + 0.0001) + minVolumeAsFrac);
    const bVolumeMax = aVolume * mapNumber(aVolumeIndex, 0, 1, 4, 1)
    const bVolume = mapNumber(bVolumeIndex, 0, 1, bVolumeMin, bVolumeMax);
    const bW      = mapNumber($fx.rand(), 0, 1, minW, maxW);
    const brd     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const brh = 1/brd;
    const bH = Math.pow(bVolume/bW * brh, 1/2);
    const bD = Math.pow(bVolume/bW * brd, 1/2);

    const cVolumeIndex = $fx.rand();
    const cVolumeMin = bVolume * mapNumber(bVolumeIndex, 0, 1, 1, Math.log(bVolumeIndex + 0.0001) + minVolumeAsFrac);
    const cVolumeMax = bVolume * mapNumber(bVolumeIndex, 0, 1, 4, 1)
    const cVolume = mapNumber(cVolumeIndex, 0, 1, cVolumeMin, cVolumeMax);
    const cW      = mapNumber($fx.rand(), 0, 1, minW, maxW);
    const crd     = mapNumber($fx.rand(), 0, 1, minAspect, maxAspect);
    const crh = 1/crd;
    const cH = Math.pow(cVolume/cW * crh, 1/2);
    const cD = Math.pow(cVolume/cW * crd, 1/2);

    const size = {
      a: {
        width:  aW,
        height: aH,
        depth:  aD
      },
      b: {
        width:  bW,
        height: bH,
        depth:  bD
      },
      c: {
        width:  cW,
        height: cH,
        depth:  cD
      }
    }

    const volume = {
      a: aVolume/maxVolume,
      b: bVolume/maxVolume,
      c: cVolume/maxVolume
    }

    return {
      size,
      volume
    }
  }

  const sizeAndVolume = Math.round($fx.rand()) ? centerWeighted() : sideWeighted();
  const size = sizeAndVolume.size;
  // console.log('volume index', sizeAndVolume.volume);

  const initY = 3;
  let hAConfXOffset = size.a.height/2;
  if (size.a.height >= size.a.width) {
    hAConfXOffset = size.a.width/2;
  };

  let hBConfXOffset = size.b.height/2;
  if (size.b.height >= size.b.width) {
    hBConfXOffset = size.b.width/2;
  };

  let hCConfXOffset = size.c.height/2;
  if (size.c.height >= size.c.width) {
    hCConfXOffset = size.c.width/2;
  };

  const zoffset = 0;

  const translation = {
    a: {
      x: -size.b.width/2 - size.a.width/2 + hBConfXOffset + hAConfXOffset,
      y: initY,
      z: size.b.depth/2 + size.a.depth/2 +zoffset
    },
    b: {
      x: 0,
      y: initY,
      z: 0 +zoffset
    },
    c: {
      x: size.b.width/2 + size.c.width/2 - hBConfXOffset - hCConfXOffset,
      y: initY,
      z: -size.b.depth/2 - size.c.depth/2 +zoffset
    }
  }

  return {
    size: sizeAndVolume.size,
    volume: sizeAndVolume.volume,
    translation,
    extrems: { maxWidth : maxW }
  }
}

export { sizePositionComposer };