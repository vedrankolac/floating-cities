import Stats from 'three/examples/jsm/libs/stats.module';

const stats = isVisible => {
  let s;

  if (isVisible) {
    s = Stats();
    document.body.appendChild(s.dom);
  }

  const showHideOnPKeyPress = (e) => {
    if (e.code === 'KeyS' && s !== undefined) {
      if (s.dom.style.display === "none") {
        s.dom.style.display = "block";
      } else {
        s.dom.style.display = "none";
      }
    } else {
      console.log('no stats initiated');
    }
  }

  document.addEventListener('keypress', showHideOnPKeyPress);

  return s;
}

export { stats };