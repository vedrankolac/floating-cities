const cubeMaterialComposer = (
  material,
  maps,
  obj,
  textureSizeMultiplier
) => {
  const tsf = textureSizeMultiplier;
  const materialFrontAndBack = material(maps, obj.colorComposition.envMapIntensity, obj.size.width * tsf, obj.size.width/(obj.size.width/obj.size.height) * tsf);
  const materialTopAndBottom = material(maps, obj.colorComposition.envMapIntensity, obj.size.width * tsf, obj.size.width/(obj.size.width/obj.size.depth)  * tsf);
  const materialLeftAndRight = material(maps, obj.colorComposition.envMapIntensity, obj.size.depth * tsf, obj.size.depth/(obj.size.depth/obj.size.height) * tsf);
  const cm =  [
    materialLeftAndRight,
    materialLeftAndRight,
    materialTopAndBottom,
    materialTopAndBottom,
    materialFrontAndBack,
    materialFrontAndBack
  ];
  return cm;
}

export { cubeMaterialComposer };