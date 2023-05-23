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

### How to prepare build for fxhash
- build 
- add './' in frot of css and js files
- use only first js file i.e. -> `<script src="./index.js" defer></script>`
- remember to remove type='module' !!! in front of first script
- delete second js file...
- add editArt script below js file in body tag `<script src="./editartParams.js" defer></script>`
- rename files to index.js and index.css
- copy paste fxhash code from their example page `https://github.com/fxhash/fxhash-simple-boilerplate/blob/master/index.html`

### How to inspect in immersive mode
- Open Oculus Developer Hub (it automatically runs ADB and you can use it over WiFi)
- Use Oculus browser to run content (not tested with Firefox Reality)
- Use Chrome to debug `chrome://inspect/#devices`
