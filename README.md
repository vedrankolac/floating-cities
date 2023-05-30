## delirious
Boilerplate for a fast start with three.js materials in rapier physics engine on Oculus Quest 2 VR headset.
- only tested on Oculus Quest 2
- movement is controlled with joystick

### Quick start
```
npm i
npm start
````

#### GitHub Page
https://vedrankolac.github.io/gravity/

### How to deploy for github pages
```bash
rm -r build
npm run build
npm run deploy
```

### How to prepare build for editArt
- build 
- make sure that drawArt is not called in World class
- remove editart-snippet
- use only first js file i.e. -> `<script src="./index.js" defer></script>`
- delete second js file...
- remember to remove type='module' !!! in front of first script
- add editArt script below js file in body tag `<script src="./editartParams.js" defer></script>`
- add './' in frot of css and js files
- rename files to index.js and index.css
- run build version with python `python -m SimpleHTTPServer 8000` and use it on `https://www.editart.xyz/sandbox`

### How to inspect in immersive mode
- Open Oculus Developer Hub (it automatically runs ADB and you can use it over WiFi)
- Use Oculus browser to run content (not tested with Firefox Reality)
- Use Chrome to debug `chrome://inspect/#devices`
