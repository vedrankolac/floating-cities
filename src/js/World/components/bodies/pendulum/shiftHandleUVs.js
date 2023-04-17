const shiftHandleUVs = (conf, uvAttribute) => {
  const w = conf.size.width;
  const h = conf.size.height;
  const d = conf.size.depth;
  const mw = conf.extremes.maxWidth;

  // left & right

  uvAttribute.setXY(
    0,
    (1 - d/mw)/2,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    1,
    (1 - d/mw)/2 + d/mw,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    2,
    (1 - d/mw)/2,
    (1 - h/mw)/2
  );
  uvAttribute.setXY(
    3,
    (1 - d/mw)/2 + d/mw,
    (1 - h/mw)/2
  );

  uvAttribute.setXY(
    4,
    (1 - d/mw)/2,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    5,
    (1 - d/mw)/2 + d/mw,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    6,
    (1 - d/mw)/2,
    (1 - h/mw)/2
  );
  uvAttribute.setXY(
    7,
    (1 - d/mw)/2 + d/mw,
    (1 - h/mw)/2
  );

  // top & bottom

  uvAttribute.setXY(
    8,
    (1 - w/mw)/2,
    (1 - d/mw)/2 + d/mw
  );
  uvAttribute.setXY(
    9,
    (1 - w/mw)/2 + w/mw,
    (1 - d/mw)/2 + d/mw
  );
  uvAttribute.setXY(
    10,
    (1 - w/mw)/2,
    (1 - d/mw)/2
  );
  uvAttribute.setXY(
    11,
    (1 - w/mw)/2 + w/mw,
    (1 - d/mw)/2
  );

  uvAttribute.setXY(
    12,
    (1 - w/mw)/2,
    (1 - d/mw)/2 + d/mw
  );
  uvAttribute.setXY(
    13,
    (1 - w/mw)/2 + w/mw,
    (1 - d/mw)/2 + d/mw
  );
  uvAttribute.setXY(
    14,
    (1 - w/mw)/2,
    (1 - d/mw)/2
  );
  uvAttribute.setXY(
    15,
    (1 - w/mw)/2 + w/mw,
    (1 - d/mw)/2
  );

  // front and back

  uvAttribute.setXY(
    16,
    (1 - w/mw)/2,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    17,
    (1 - w/mw)/2 + w/mw,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    18,
    (1 - w/mw)/2,
    (1 - h/mw)/2
  );
  uvAttribute.setXY(
    19,
    (1 - w/mw)/2 + w/mw,
    (1 - h/mw)/2
  );

  uvAttribute.setXY(
    20,
    (1 - w/mw)/2,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    21,
    (1 - w/mw)/2 + w/mw,
    (1 - h/mw)/2 + h/mw
  );
  uvAttribute.setXY(
    22,
    (1 - w/mw)/2,
    (1 - h/mw)/2
  );
  uvAttribute.setXY(
    23,
    (1 - w/mw)/2 + w/mw,
    (1 - h/mw)/2
  );
}

export { shiftHandleUVs }