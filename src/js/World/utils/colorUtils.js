import { Color } from "three";

const hslToHex = (h, s, l) => {
  const color = new Color();
  color.setHSL(h, s, l);
  return color;
};

export { hslToHex };