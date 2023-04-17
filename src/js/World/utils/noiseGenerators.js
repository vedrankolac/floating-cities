const randomNoiseWithLevel = (canvas, level = 256, x = 0, y = 0, alpha = 255) => {
  const w = canvas.width;
  const h = canvas.height;
  const g = canvas.getContext("2d");
  const imageData = g.getImageData(x, y, w, h);
  const pixels = imageData.data;
  const n = pixels.length;
  let i = 0;
  while (i < n) {
      pixels[i++] = pixels[i++] = pixels[i++] = ($fx.rand() * level) | 0;
      pixels[i++] = alpha;
  }
  g.putImageData(imageData, x, y);
  return canvas;
}

export { randomNoiseWithLevel };