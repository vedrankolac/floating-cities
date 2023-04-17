const planetsConfig = () => {
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/
  const config = [
    {
      name: 'Mercury',
      gravity: 3.7,
    },
    {
      name: 'Venus',
      gravity: 8.9,
    },
    {
      name: 'Earth',
      gravity: 9.8,
    },
    {
      name: 'Moon',
      gravity: 1.6,
    },
    {
      name: 'Mars',
      gravity: 3.7,
    },
    {
      name: 'Jupiter',
      gravity: 23.1,
    },
    {
      name: 'Saturn',
      gravity: 9.0,
    },
    {
      name: 'Uranus',
      gravity: 8.7,
    },
    {
      name: 'Neptune',
      gravity: 11.0,
    },
    {
      name: 'Pluto',
      gravity: 0.7,
    },
  ];

  const gi = Math.round((config.length - 1) * $fx.rand());
  // const gi = 5;
  console.log('planet:   ', config[gi].name, config[gi].gravity);
  return config[gi];
}

export { planetsConfig };