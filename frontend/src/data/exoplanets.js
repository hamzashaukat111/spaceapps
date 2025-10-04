// Exoplanet data - sourced from NASA Exoplanet Archive
// This would typically come from an API, but using static data for demo

export const exoplanetDatabase = [
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    discoveryYear: 2015,
    discoveryMethod: 'Transit',
    hostStar: {
      name: 'Kepler-452',
      type: 'G-type',
      temperature: 5757,
      mass: 1.04,
      radius: 1.11,
      distance: 1402 // light years
    },
    planet: {
      type: 'terrestrial',
      radius: 1.6, // Earth radii
      mass: null, // Unknown
      orbitalPeriod: 384.8, // days
      semiMajorAxis: 1.05, // AU
      eccentricity: 0.0,
      equilibriumTemp: 265, // Kelvin
      habitableZone: true
    },
    description: "Often called Earth's cousin, Kepler-452b is the first near-Earth-size planet discovered in the habitable zone of a sun-like star.",
    significance: "First potentially habitable Earth-size planet around a G-type star",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop"
  },
  
  {
    id: 'proxima-centauri-b',
    name: 'Proxima Centauri b',
    discoveryYear: 2016,
    discoveryMethod: 'Radial Velocity',
    hostStar: {
      name: 'Proxima Centauri',
      type: 'M-dwarf',
      temperature: 3042,
      mass: 0.12,
      radius: 0.15,
      distance: 4.24
    },
    planet: {
      type: 'terrestrial',
      radius: 1.17,
      mass: 1.27,
      orbitalPeriod: 11.2,
      semiMajorAxis: 0.05,
      eccentricity: 0.11,
      equilibriumTemp: 234,
      habitableZone: true
    },
    description: "The closest known exoplanet to Earth, located in the habitable zone of our nearest stellar neighbor.",
    significance: "Closest potentially habitable exoplanet to Earth",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop"
  },

  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    discoveryYear: 2017,
    discoveryMethod: 'Transit',
    hostStar: {
      name: 'TRAPPIST-1',
      type: 'M-dwarf',
      temperature: 2511,
      mass: 0.08,
      radius: 0.12,
      distance: 39.5
    },
    planet: {
      type: 'terrestrial',
      radius: 0.92,
      mass: 0.77,
      orbitalPeriod: 6.1,
      semiMajorAxis: 0.029,
      eccentricity: 0.0,
      equilibriumTemp: 251,
      habitableZone: true
    },
    description: "One of seven Earth-sized planets in the TRAPPIST-1 system, located in the habitable zone.",
    significance: "Part of the most Earth-like planetary system discovered",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop"
  },

  {
    id: 'hd-40307g',
    name: 'HD 40307g',
    discoveryYear: 2012,
    discoveryMethod: 'Radial Velocity',
    hostStar: {
      name: 'HD 40307',
      type: 'K-dwarf',
      temperature: 4977,
      mass: 0.77,
      radius: 0.72,
      distance: 42
    },
    planet: {
      type: 'super-earth',
      radius: 1.4,
      mass: 7.1,
      orbitalPeriod: 197.8,
      semiMajorAxis: 0.6,
      eccentricity: 0.0,
      equilibriumTemp: 227,
      habitableZone: true
    },
    description: "A super-Earth located in the habitable zone of an orange dwarf star.",
    significance: "One of the first super-Earths found in a habitable zone",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },

  {
    id: '51-eridani-b',
    name: '51 Eridani b',
    discoveryYear: 2014,
    discoveryMethod: 'Direct Imaging',
    hostStar: {
      name: '51 Eridani',
      type: 'F-type',
      temperature: 7370,
      mass: 1.75,
      radius: 1.45,
      distance: 28.1
    },
    planet: {
      type: 'gas-giant',
      radius: 1.22,
      mass: 2.6,
      orbitalPeriod: 10950,
      semiMajorAxis: 13,
      eccentricity: 0.0,
      equilibriumTemp: 435,
      habitableZone: false
    },
    description: "A young gas giant with methane in its atmosphere, similar to Jupiter but much younger.",
    significance: "First exoplanet discovered with methane using direct imaging",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop"
  }
];

// Helper functions for working with exoplanet data
export const getExoplanetById = (id) => {
  return exoplanetDatabase.find(planet => planet.id === id);
};

export const getExoplanetsByType = (type) => {
  return exoplanetDatabase.filter(planet => planet.planet.type === type);
};

export const getHabitableExoplanets = () => {
  return exoplanetDatabase.filter(planet => planet.planet.habitableZone);
};

export const getExoplanetsByDiscoveryYear = (year) => {
  return exoplanetDatabase.filter(planet => planet.discoveryYear === year);
};

export const getExoplanetsByDistance = (maxDistance) => {
  return exoplanetDatabase.filter(planet => planet.hostStar.distance <= maxDistance);
};

// Search function for exoplanets
export const searchExoplanets = (query) => {
  const searchTerm = query.toLowerCase();
  return exoplanetDatabase.filter(planet => 
    planet.name.toLowerCase().includes(searchTerm) ||
    planet.hostStar.name.toLowerCase().includes(searchTerm) ||
    planet.description.toLowerCase().includes(searchTerm) ||
    planet.planet.type.toLowerCase().includes(searchTerm)
  );
};

// Statistics functions
export const getExoplanetStats = () => {
  const total = exoplanetDatabase.length;
  const habitable = getHabitableExoplanets().length;
  const terrestrial = getExoplanetsByType('terrestrial').length;
  const gasGiants = getExoplanetsByType('gas-giant').length;
  
  const avgDistance = exoplanetDatabase.reduce((sum, planet) => 
    sum + planet.hostStar.distance, 0) / total;
  
  const discoveryYears = [...new Set(exoplanetDatabase.map(p => p.discoveryYear))];
  
  return {
    total,
    habitable,
    terrestrial,
    gasGiants,
    avgDistance: Math.round(avgDistance * 10) / 10,
    discoveryYears: discoveryYears.sort(),
    closestDistance: Math.min(...exoplanetDatabase.map(p => p.hostStar.distance)),
    farthestDistance: Math.max(...exoplanetDatabase.map(p => p.hostStar.distance))
  };
};

export default exoplanetDatabase;