export const setPrintTools = (renderer, composer, postprocessingEnabled, scene, camera) => {
  const saveOnPKeyPress = (e) => {
    if (e.code === 'KeyP') {
      saveAsPng();
    }
    if (e.code === 'KeyE') {
      console.log('E');
      m0 = Math.random();
      m1 = Math.random();
      m2 = Math.random();
      m3 = Math.random();
      m4 = Math.random();
      drawArt();
    }
    if (e.code === 'KeyC') {
      console.log('C');
      // m1 = Math.random();
      randomM1();
      drawArt();
    }
  }

  const saveAsPng = () => {
    console.log('downloading...');

    if (postprocessingEnabled) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    const imgData = renderer.domElement.toDataURL();
    var img = new Image();
    img.src = imgData;

    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = imgData;
    link.click();
    link.delete;
  }

  const saveAsPngAndRefresh = () => {
    // saveAsPng();
    clearInterval(nIntervId);
    nIntervId = null;
    location.reload();
  }

  // let nIntervId = setInterval(saveAsPngAndRefresh, 20000);
  document.addEventListener('keypress', saveOnPKeyPress);
}