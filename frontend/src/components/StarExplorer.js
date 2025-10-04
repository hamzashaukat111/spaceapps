import React, { useState, useRef, useEffect } from 'react';
import Advanced3DSolarSystem from './Advanced3DSolarSystem';
import './StarExplorer.css';

const StarExplorer = ({ isOpen, onClose }) => {
  const [selectedStar, setSelectedStar] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // map, system, planet
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const canvasRef = useRef(null);
  const [, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredStar, setHoveredStar] = useState(null);

  // Star catalog data - based on real exoplanet discoveries
  // TODO: Move this to a separate data file or API call
  const starCatalog = [
    {
      id: 'kepler-452',
      name: 'Kepler-452',
      type: 'G-type',
      distance: 1402,
      coordinates: { x: 200, y: 150 },
      color: '#ffeb3b',
      size: 1.11,
      temperature: 5757,
      planets: [
        {
          id: 'kepler-452b',
          name: 'Kepler-452b',
          type: 'terrestrial',
          radius: 1.6,
          orbitalPeriod: 385,
          distance: 1.05,
          color: '#81c784',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'Often called "Earth\'s cousin", this super-Earth orbits in the habitable zone of a Sun-like star.'
        }
      ]
    },
    {
      id: 'trappist-1',
      name: 'TRAPPIST-1',
      type: 'M-dwarf',
      distance: 39.5,
      coordinates: { x: 350, y: 200 },
      color: '#ff5722',
      size: 0.12,
      temperature: 2511,
      planets: [
        {
          id: 'trappist-1b',
          name: 'TRAPPIST-1b',
          type: 'terrestrial',
          radius: 1.12,
          orbitalPeriod: 1.51,
          distance: 0.0115,
          color: '#ff6b35',
          hasAtmosphere: false,
          habitableZone: false,
          description: 'The innermost planet, likely tidally locked with extreme temperatures.'
        },
        {
          id: 'trappist-1e',
          name: 'TRAPPIST-1e',
          type: 'terrestrial',
          radius: 0.92,
          orbitalPeriod: 6.1,
          distance: 0.029,
          color: '#4fc3f7',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'Located in the habitable zone with potential for liquid water.'
        },
        {
          id: 'trappist-1f',
          name: 'TRAPPIST-1f',
          type: 'terrestrial',
          radius: 1.05,
          orbitalPeriod: 9.2,
          distance: 0.037,
          color: '#81c784',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'Another potentially habitable world with moderate temperatures.'
        }
      ]
    },
    {
      id: 'proxima-centauri',
      name: 'Proxima Centauri',
      type: 'M-dwarf',
      distance: 4.24,
      coordinates: { x: 150, y: 300 },
      color: '#d32f2f',
      size: 0.15,
      temperature: 3042,
      planets: [
        {
          id: 'proxima-b',
          name: 'Proxima Centauri b',
          type: 'terrestrial',
          radius: 1.17,
          orbitalPeriod: 11.2,
          distance: 0.05,
          color: '#ff8a65',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'The closest known exoplanet to Earth, potentially habitable despite stellar flares.'
        }
      ]
    },
    {
      id: 'hd-40307',
      name: 'HD 40307',
      type: 'K-dwarf',
      distance: 42,
      coordinates: { x: 400, y: 120 },
      color: '#ff9800',
      size: 0.77,
      temperature: 4977,
      planets: [
        {
          id: 'hd-40307g',
          name: 'HD 40307g',
          type: 'terrestrial',
          radius: 1.4,
          orbitalPeriod: 197,
          distance: 0.6,
          color: '#4caf50',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'A super-Earth in the habitable zone with potential for complex weather systems.'
        }
      ]
    },
    {
      id: '51-eridani',
      name: '51 Eridani',
      type: 'F-type',
      distance: 28.1,
      coordinates: { x: 300, y: 280 },
      color: '#fff9c4',
      size: 1.75,
      temperature: 7370,
      planets: [
        {
          id: '51-eridani-b',
          name: '51 Eridani b',
          type: 'gas-giant',
          radius: 1.22,
          orbitalPeriod: 10950,
          distance: 13,
          color: '#3f51b5',
          hasAtmosphere: true,
          habitableZone: false,
          description: 'A young gas giant with methane in its atmosphere, similar to Jupiter.'
        }
      ]
    },
    {
      id: 'gliese-667c',
      name: 'Gliese 667C',
      type: 'M-dwarf',
      distance: 23.6,
      coordinates: { x: 180, y: 220 },
      color: '#ff3d00',
      size: 0.31,
      temperature: 3700,
      planets: [
        {
          id: 'gliese-667cc',
          name: 'Gliese 667Cc',
          type: 'terrestrial',
          radius: 1.54,
          orbitalPeriod: 28.1,
          distance: 0.125,
          color: '#8bc34a',
          hasAtmosphere: true,
          habitableZone: true,
          description: 'A super-Earth receiving similar stellar flux to Earth, potentially habitable.'
        }
      ]
    }
  ];

  // Redraw star map when view changes or user interactions occur
  useEffect(() => {
    if (viewMode === 'map') {
      drawStarMap();
    }
  }, [viewMode, hoveredStar, selectedStar]);

  // Animation frame for smooth planet orbits
  useEffect(() => {
    let animationFrame;
    if (viewMode === 'map') {
      const animate = () => {
        drawStarMap();
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [viewMode]);

  const drawStarMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Set canvas size to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(100, 181, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw constellation lines
    ctx.strokeStyle = 'rgba(100, 181, 246, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < starCatalog.length - 1; i++) {
      const star1 = starCatalog[i];
      const star2 = starCatalog[i + 1];
      ctx.beginPath();
      ctx.moveTo(star1.coordinates.x, star1.coordinates.y);
      ctx.lineTo(star2.coordinates.x, star2.coordinates.y);
      ctx.stroke();
    }

    // Render each star in the catalog
    starCatalog.forEach((star, index) => {
      const isHovered = hoveredStar?.id === star.id;
      const isSelected = selectedStar?.id === star.id;
      
      // Add glow effect for interactive states
      if (isHovered || isSelected) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = star.color;
        ctx.fillStyle = star.color + '40'; // Semi-transparent glow
        ctx.beginPath();
        ctx.arc(star.coordinates.x, star.coordinates.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw the main star
      const starRadius = Math.max(3, star.size * 8);
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.coordinates.x, star.coordinates.y, starRadius, 0, Math.PI * 2);
      ctx.fill();

      // Show orbiting planets around each star
      if (star.planets && star.planets.length > 0) {
        star.planets.forEach((planet, planetIndex) => {
          const orbitRadius = starRadius + 15 + (planetIndex * 8);
          const planetSize = 2;
          
          // Use different colors for habitable vs non-habitable planets
          ctx.fillStyle = planet.habitableZone ? '#4caf50' : planet.color;
          ctx.beginPath();
          
          // Animate planet positions based on time
          const time = Date.now() * 0.001;
          const angle = time + planetIndex;
          const planetX = star.coordinates.x + Math.cos(angle) * orbitRadius;
          const planetY = star.coordinates.y + Math.sin(angle) * orbitRadius;
          
          ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#4dd0e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(star.coordinates.x, star.coordinates.y, starRadius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Star label
      if (isHovered || isSelected) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(star.name, star.coordinates.x, star.coordinates.y - starRadius - 15);
        
        // Distance label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.fillText(`${star.distance} ly`, star.coordinates.x, star.coordinates.y - starRadius - 5);
      }
    });
  };

  const handleCanvasClick = (event) => {
    if (viewMode !== 'map') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check if click is within any star's radius
    const clickedStar = starCatalog.find(star => {
      const dx = clickX - star.coordinates.x;
      const dy = clickY - star.coordinates.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const clickRadius = Math.max(3, star.size * 8) + 10; // Add some padding for easier clicking
      return distance <= clickRadius;
    });

    if (clickedStar) {
      setSelectedStar(clickedStar);
      setViewMode('system');
    }
  };

  const handleCanvasMouseMove = (event) => {
    if (viewMode !== 'map') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Update mouse position for potential future use
    setMousePos({ x: mouseX, y: mouseY });

    // Find star under mouse cursor
    const hoveredStar = starCatalog.find(star => {
      const dx = mouseX - star.coordinates.x;
      const dy = mouseY - star.coordinates.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hoverRadius = Math.max(3, star.size * 8) + 10;
      return distance <= hoverRadius;
    });

    setHoveredStar(hoveredStar);
    
    // Change cursor style when hovering over stars
    if (canvas) {
      canvas.style.cursor = hoveredStar ? 'pointer' : 'default';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="star-explorer-overlay">
      <div className="star-explorer-modal">
        <div className="explorer-header">
          <div className="explorer-nav">
            <button 
              className={`nav-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Star Map
            </button>
            {selectedStar && (
              <button 
                className={`nav-btn ${viewMode === 'system' ? 'active' : ''}`}
                onClick={() => setViewMode('system')}
              >
                🌌 {selectedStar.name} System
              </button>
            )}
            {selectedPlanet && (
              <button 
                className={`nav-btn ${viewMode === 'planet' ? 'active' : ''}`}
                onClick={() => setViewMode('planet')}
              >
                🪐 {selectedPlanet.name}
              </button>
            )}
          </div>
          
          <button className="explorer-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="explorer-content">
          {viewMode === 'map' && (
            <div className="star-map-view">
              <canvas
                ref={canvasRef}
                className="star-map-canvas"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
              />
              
              <div className="map-info-panel">
                <h3>🔭 Interactive Star Map</h3>
                <p>Click on stars to explore their planetary systems</p>
                
                <div className="legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
                    <span>Habitable Zone Planet</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
                    <span>Other Planet</span>
                  </div>
                </div>

                {hoveredStar && (
                  <div className="star-info-card">
                    <h4>{hoveredStar.name}</h4>
                    <div className="star-details">
                      <div className="detail-row">
                        <span>Type:</span>
                        <span>{hoveredStar.type}</span>
                      </div>
                      <div className="detail-row">
                        <span>Distance:</span>
                        <span>{hoveredStar.distance} light-years</span>
                      </div>
                      <div className="detail-row">
                        <span>Temperature:</span>
                        <span>{hoveredStar.temperature}K</span>
                      </div>
                      <div className="detail-row">
                        <span>Planets:</span>
                        <span>{hoveredStar.planets.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'system' && selectedStar && (
            <div className="system-view">
              <div className="system-header">
                <h2>{selectedStar.name} System</h2>
                <p>{selectedStar.distance} light-years from Earth</p>
              </div>

              <div className="system-visualization">
                <Advanced3DSolarSystem />
              </div>

              <div className="planets-grid">
                {selectedStar.planets.map(planet => (
                  <div 
                    key={planet.id} 
                    className="planet-card"
                    onClick={() => {
                      setSelectedPlanet(planet);
                      setViewMode('planet');
                    }}
                  >
                    <div className="planet-preview">
                      <div className="planet-preview-placeholder" style={{ height: '100px' }}>
                        <div className="planet-visualization">
                          <div className={`planet-sphere ${planet.type} ${planet.hasAtmosphere ? 'atmosphere' : ''}`} 
                               style={{ backgroundColor: planet.color }}></div>
                          {planet.type === 'gas-giant' && <div className="planet-rings"></div>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="planet-info">
                      <h4>{planet.name}</h4>
                      <div className="planet-stats">
                        <div className="stat">
                          <span>Radius:</span>
                          <span>{planet.radius} R⊕</span>
                        </div>
                        <div className="stat">
                          <span>Period:</span>
                          <span>{planet.orbitalPeriod} days</span>
                        </div>
                        {planet.habitableZone && (
                          <div className="habitable-badge">
                            🌍 Potentially Habitable
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'planet' && selectedPlanet && (
            <div className="planet-view">
              <div className="planet-header">
                <h2>{selectedPlanet.name}</h2>
                <p>{selectedPlanet.description}</p>
              </div>

              <div className="planet-details-grid">
                <div className="planet-visual">
                  <div className="planet-detail-placeholder" style={{ height: '300px' }}>
                    <div className="planet-visualization large">
                      <div className={`planet-sphere ${selectedPlanet.type} ${selectedPlanet.hasAtmosphere ? 'atmosphere' : ''}`} 
                           style={{ backgroundColor: selectedPlanet.color }}></div>
                      {selectedPlanet.type === 'gas-giant' && <div className="planet-rings"></div>}
                      {selectedPlanet.hasAtmosphere && <div className="planet-atmosphere"></div>}
                    </div>
                    <div className="planet-label">{selectedPlanet.name}</div>
                  </div>
                </div>

                <div className="planet-data">
                  <h3>Planetary Data</h3>
                  <div className="data-grid">
                    <div className="data-item">
                      <span className="data-label">Type:</span>
                      <span className="data-value">{selectedPlanet.type}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Radius:</span>
                      <span className="data-value">{selectedPlanet.radius} Earth radii</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Orbital Period:</span>
                      <span className="data-value">{selectedPlanet.orbitalPeriod} days</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Distance from Star:</span>
                      <span className="data-value">{selectedPlanet.distance} AU</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Atmosphere:</span>
                      <span className="data-value">{selectedPlanet.hasAtmosphere ? 'Present' : 'None detected'}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Habitable Zone:</span>
                      <span className="data-value">{selectedPlanet.habitableZone ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>

                  {selectedPlanet.habitableZone && (
                    <div className="habitability-analysis">
                      <h4>🌍 Habitability Assessment</h4>
                      <div className="analysis-points">
                        <div className="analysis-point positive">
                          ✅ Located in habitable zone
                        </div>
                        {selectedPlanet.hasAtmosphere && (
                          <div className="analysis-point positive">
                            ✅ Atmosphere detected
                          </div>
                        )}
                        <div className="analysis-point neutral">
                          🔬 Further study needed for biosignatures
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarExplorer;