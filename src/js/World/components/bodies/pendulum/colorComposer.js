import { hslToHex } from "../../../utils/colorUtils";
import { shuffle } from "../../../utils/arrayFxRnd"

const colorComposer = () => {
  const colorCompositionID = $fx.rand();
  const envMapIntensity = 1;

  // primitives

  const black = {
    color: hslToHex(0, 0, 0.04),
    envMapIntensity: envMapIntensity - 0.1,
    name: 'Black'
  };
  const white = {
    color: hslToHex(0, 0, 0.85),
    envMapIntensity: envMapIntensity - 0.1,
    name: 'White'
  };

  const paleteGenerators = [];

  // palette tools

  const brightSaturation = () => $fx.rand() * 0.1 + 0.9;
  const strongSaturation = () => $fx.rand() * 0.2 + 0.8;
  const darkSaturation   = () => $fx.rand() * 0.4 + 0.2;

  const brightLightness = () => $fx.rand() * 0.35 + 0.5;
  const strongLightness = () => $fx.rand() * 0.3  + 0.2;
  const darkLightness   = () => $fx.rand() * 0.2  + 0.04;

  const brightTheme = [brightSaturation(), brightLightness()];
  const strongTheme = [strongSaturation(), strongLightness()];
  const darkTheme   = [darkSaturation(), darkLightness()];

  const themes = [
    brightTheme,
    strongTheme,
    darkTheme
  ]

  const getHueVariants = hue => {
    return [
      hue + $fx.rand() * 0.2 + 0.5,
      hue + $fx.rand() * 0.2 + 0.5,
    ]
  }

  const grayscaleBright = () => $fx.rand() * 0.35 + 0.5;
  const grayscaleStrong = () => $fx.rand() * 0.3  + 0.2;
  const grayscaleDark   = () => $fx.rand() * 0.2  + 0.0;

  const grayscaleThemes = [
    grayscaleBright(),
    grayscaleStrong(),
    grayscaleDark()
  ]

  // palettes

  const whiteBlackColor = () => {
    const themeSeed = $fx.rand();
    const themeIndex = Math.round((themes.length - 1) * themeSeed);
    const theme = themes[themeIndex];

    const a = black;
    const b = white;
    const c = {
      color: hslToHex($fx.rand(), ...theme),
      envMapIntensity,
      name: 'Color'
    };

    const bgSeed = $fx.rand();
    let bg;

    if (bgSeed < 0.9) {
      bg = c;
    } else if (bgSeed >= 0.9 && bgSeed < 0.95) {
      bg = b;
    } else if (bgSeed >= 0.95 && bgSeed < 1.0) {
      bg = a;
    }

    const randomized = shuffle([a,b,c]);

    return {
      a: randomized[0],
      b: randomized[1],
      c: randomized[2],
      bg,
      colorBalance: {
        cb1: $fx.rand() * 0.3 + 0.3,
        cb2: $fx.rand() * 0.3 + 0.3,
      },
      name: 'Color, Black & White'
    }
  }
  paleteGenerators.push(whiteBlackColor);

  const duoAndLightness = () => {
    const themeSeed = $fx.rand();
    const themeIndex = Math.round((themes.length - 1) * themeSeed);
    const theme = themes[0];

    const themeASeed = $fx.rand();
    const themeAIndex = Math.round((themes.length - 1) * themeASeed);
    const themeA = themes[themeAIndex];

    const themeBSeed = $fx.rand();
    const themeBIndex = Math.round((themes.length - 1) * themeBSeed);
    const themeB = themes[2];

    const initHue = $fx.rand() * 0.14;
    const secondHueVariants = getHueVariants(initHue);
    const secondHueSeed = $fx.rand();
    const secondHueIndex = Math.round((secondHueVariants.length - 1) * secondHueSeed);
    const secondHue = secondHueVariants[secondHueIndex];

    const a = Math.round($fx.rand()) ? white : black;
    const b = {
      color: hslToHex(initHue, ...themeA),
      envMapIntensity,
      name: 'Color'
    };
    const c = {
      color: hslToHex(secondHue, ...themeB),
      envMapIntensity,
      name: 'Color'
    };

    const bgSeed = $fx.rand();
    let bg;

    if (bgSeed < 0.45) {
      bg = b;
    } else if (bgSeed >= 0.45 && bgSeed < 0.9) {
      bg = c;
    } else if (bgSeed >= 0.9 && bgSeed < 1.0) {
      bg = white;
    }

    const randomized = shuffle([a,b,c]);

    let ccName;
    if (a.name === 'Black') {
      ccName = 'Two Colors & Black';
    } else  if (a.name === 'White') {
      ccName = 'Two Colors & White';
    };

    return {
      a: randomized[0],
      b: randomized[1],
      c: randomized[2],
      bg: bg,
      colorBalance: {
        cb1: $fx.rand() * 0.2 + 0.66,
        cb2: $fx.rand() * 0.2 + 0.6,
      },
      name: ccName
    }
  }
  paleteGenerators.push(duoAndLightness);

  const tripple = () => {
    const themeASeed = $fx.rand();
    const themeAIndex = Math.round((themes.length - 1) * themeASeed);
    const themeA = themes[0];

    const themeBSeed = $fx.rand();
    const themeBIndex = Math.round((themes.length - 1) * themeBSeed);
    const themeB = themes[themeBIndex];

    const themeCSeed = $fx.rand();
    const themeCIndex = Math.round((themes.length - 2) * themeCSeed);
    const themeC = themes[2];

    const initHue = $fx.rand() * 0.14;

    const secondHueVariants = getHueVariants(initHue);
    const secondHueSeed = $fx.rand();
    const secondHueIndex = Math.round((secondHueVariants.length - 1) * secondHueSeed);
    const secondHue = secondHueVariants[secondHueIndex];

    const thirdHueVariants = getHueVariants(secondHue);
    const thirdHueSeed = $fx.rand();
    const thirdHueIndex = Math.round((thirdHueVariants.length - 1) * thirdHueSeed);
    const thirdHue = thirdHueVariants[thirdHueIndex];

    const a = {
      color: hslToHex(initHue, ...themeA),
      envMapIntensity,
      name: 'Color'
    };
    const b = {
      color: hslToHex(secondHue, ...themeB),
      envMapIntensity,
      name: 'Color'
    };
    const c = {
      color: hslToHex(thirdHue, ...themeC),
      envMapIntensity,
      name: 'Color'
    };

    const randomized = shuffle([a,b,c]);

    const bg1 = black;
    const bg2 = white;

    const bgSeed = $fx.rand();
    let bg;

    if (bgSeed < 0.9) {
      const cSeed = $fx.rand();
      if (cSeed < 0.33) {
        bg = a;
      } else if (cSeed >= 0.33 && cSeed < 0.66) {
        bg = b;
      } else if (cSeed >= 0.66 && cSeed <= 1.0) {
        bg = c;
      }
    } else if (bgSeed >= 0.9 && bgSeed <= 1.0) {
      bg = bg2;
    }

    return {
      a: randomized[0],
      b: randomized[1],
      c: randomized[2],
      bg: bg,
      colorBalance: {
        cb1: $fx.rand() * 0.2 + 0.66,
        cb2: $fx.rand() * 0.2 + 0.6,
      },
      name: 'Three Colors'
    };
  }
  paleteGenerators.push(tripple);

  const grayscale = () => {
    const themeASeed = $fx.rand();
    const themeAIndex = Math.round((grayscaleThemes.length - 1) * themeASeed);
    const themeA = grayscaleThemes[0];

    const themeBSeed = $fx.rand();
    const themeBIndex = Math.round((grayscaleThemes.length - 1) * themeBSeed);
    const themeB = grayscaleThemes[themeBIndex];

    const themeCSeed = $fx.rand();
    const themeCIndex = Math.round((grayscaleThemes.length - 1) * themeCSeed);
    const themeC = grayscaleThemes[2];

    const a = {
      color: hslToHex(0, 0, themeA),
      envMapIntensity,
      name: 'Gray'
    };
    const b = {
      color: hslToHex(0, 0, themeB),
      envMapIntensity,
      name: 'Gray'
    };
    const c = {
      color: hslToHex(0, 0, themeC),
      envMapIntensity,
      name: 'Gray'
    };

    const randomized = shuffle([a,b,c]);

    // const bg1 = black;
    const bg2 = white;
    const randomizedBg = shuffle([a,b,c,bg2]);

    return {
      a: randomized[0],
      b: randomized[1],
      c: randomized[2],
      bg: randomizedBg[0],
      colorBalance: {
        cb1: $fx.rand() * 0.6 + 0.3,
        cb2: $fx.rand() * 0.6 + 0.3,
      },
      name: 'Grayscale'
    }
  }
  paleteGenerators.push(grayscale);

  let colorConfig = null;

  if (colorCompositionID < 0.05) {
    colorConfig = grayscale();
  } else if ((colorCompositionID >= 0.05) && (colorCompositionID < 0.6)) {
    colorConfig = whiteBlackColor();
  } else if ((colorCompositionID >= 0.6) && (colorCompositionID < 0.8)) {
    colorConfig = tripple();
  } else if ((colorCompositionID >= 0.8) && (colorCompositionID <= 1)) {
    colorConfig = duoAndLightness();
  }

  // colorConfig = grayscale();
  // colorConfig = whiteBlackColor();
  // colorConfig = duoAndLightness();
  // colorConfig = tripple();

  // let hsl = {};
  // colorConfig.bg.color.getHSL(hsl);

  // if (hsl.s === 0 && hsl.l === 0.04) {
  //   colorConfig.bgName = 'Black';
  // } else if (hsl.s === 0 && hsl.l === 0.85) {
  //   colorConfig.bgName = 'White';
  // } else if (hsl.s === 0 && (hsl.l > 0.04 && hsl.l < 0.85)) {
  //   colorConfig.bgName = 'Gray';
  // } else {
  //   colorConfig.bgName = 'Color';
  // }

  console.log('palette:  ', colorConfig.name, '- ', colorConfig.bg.name);
  return colorConfig;
}

export { colorComposer };
