import React, { useState } from 'react';
import './ExoplanetCatalog.css';

const ExoplanetCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const exoplanets = [
    {
      id: 1,
      name: 'K2-138 b',
      hostStar: 'K2-138 (small, cool red dwarf)',
      distance: '0.00',
      type: 'Rocky',
      color: '#ff8c42',
      size: 'small'
    },
    {
      id: 2,
      name: 'Gliese 667 Cc',
      hostStar: 'Gliese 667 C (small, cool red dwarf)',
      distance: '0.00',
      type: 'Super Earth',
      color: '#e8b4b8',
      size: 'medium'
    },
    {
      id: 3,
      name: 'Kepler-452b',
      hostStar: 'Kepler-452 (G-type)',
      distance: '0.00',
      type: 'Super Earth',
      color: '#2c5f2d',
      size: 'medium'
    },
    {
      id: 4,
      name: 'LHS 1140 b',
      hostStar: 'LHS 1140 (small, cool red dwarf)',
      distance: '0.00',
      type: 'Rocky',
      color: '#ff6b35',
      size: 'small'
    },
    {
      id: 5,
      name: '55 Cancri e',
      hostStar: '55 Cancri (G-type)',
      distance: '3,000.00',
      type: 'Super Earth',
      color: '#c0c0c0',
      size: 'medium'
    },
    {
      id: 6,
      name: 'KELT-9b',
      hostStar: 'KELT-9 (A-type)',
      distance: '0.00',
      type: 'Hot Jupiter',
      color: '#ff4500',
      size: 'large'
    },
    {
      id: 7,
      name: 'Boszorgi 70 b',
      hostStar: 'Boszorgi 70',
      distance: '0.00',
      type: 'Gas Giant',
      color: '#4169e1',
      size: 'large'
    }
  ];

  const filteredPlanets = exoplanets.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.hostStar.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="catalog page-container">
      <div className="catalog-header">
        <h1 className="page-title">Exoplanet Catalog</h1>
        <button className="info-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="planets-list">
        {filteredPlanets.map((planet) => (
          <div
            key={planet.id}
            className="planet-item"
            onClick={() => setSelectedPlanet(planet)}
          >
            <div className="planet-visual">
              <div className="catalog-planet-placeholder" style={{ height: '80px' }}>
                <div className="planet-visualization small">
                  <div className={`planet-sphere ${planet.type === 'Gas Giant' ? 'gas-giant' : 
                                 planet.type === 'Rocky' ? 'terrestrial' : 'ice-giant'} ${planet.type !== 'Rocky' ? 'atmosphere' : ''}`} 
                       style={{ backgroundColor: planet.color }}></div>
                  {planet.type === 'Gas Giant' && <div className="planet-rings"></div>}
                </div>
              </div>
            </div>
            
            <div className="planet-info">
              <div className="planet-distance">{planet.distance}</div>
              <h3 className="planet-name">{planet.name}</h3>
              <p className="planet-host">{planet.hostStar}</p>
            </div>
            
            <div className="planet-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {selectedPlanet && (
        <div className="planet-modal-overlay" onClick={() => setSelectedPlanet(null)}>
          <div className="planet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPlanet.name}</h2>
              <button className="modal-close" onClick={() => setSelectedPlanet(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-planet">
                <div className="modal-planet-placeholder" style={{ height: '200px' }}>
                  <div className="planet-visualization large">
                    <div className={`planet-sphere ${selectedPlanet.type === 'Gas Giant' ? 'gas-giant' : 
                                   selectedPlanet.type === 'Rocky' ? 'terrestrial' : 'ice-giant'} ${selectedPlanet.type !== 'Rocky' ? 'atmosphere' : ''}`} 
                         style={{ backgroundColor: selectedPlanet.color }}></div>
                    {selectedPlanet.type === 'Gas Giant' && <div className="planet-rings"></div>}
                    {selectedPlanet.type !== 'Rocky' && <div className="planet-atmosphere"></div>}
                  </div>
                  <div className="planet-label">{selectedPlanet.name}</div>
                </div>
              </div>
              
              <div className="modal-details">
                <div className="detail-row">
                  <span className="detail-label">Host Star:</span>
                  <span className="detail-value">{selectedPlanet.hostStar}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedPlanet.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Distance:</span>
                  <span className="detail-value">{selectedPlanet.distance} light years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExoplanetCatalog;