import React, { useState, useEffect } from 'react';
import './DiscoveryCards.css';

const DiscoveryCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCard, setCurrentCard] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discoveries = [
    {
      id: 1,
      name: 'Galactic Horizon',
      type: 'Super-Earth',
      confidence: 0.97,
      images: [
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop'
      ],
      description: 'A potentially habitable super-Earth located in the Goldilocks zone of its host star.',
      stats: {
        mass: '3.2 Earth masses',
        radius: '1.6 Earth radii',
        temperature: '288 K',
        distance: '127 light years'
      }
    },
    {
      id: 2,
      name: 'Cosmic Wanderer',
      type: 'Gas Giant',
      confidence: 0.89,
      images: [
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop'
      ],
      description: 'A massive gas giant with an unusual orbital pattern that defies conventional models.',
      stats: {
        mass: '2.1 Jupiter masses',
        radius: '1.3 Jupiter radii',
        temperature: '1,200 K',
        distance: '89 light years'
      }
    },
    {
      id: 3,
      name: 'Stellar Companion',
      type: 'Rocky Planet',
      confidence: 0.94,
      images: [
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop'
      ],
      description: 'A rocky planet with evidence of volcanic activity and a thin atmosphere.',
      stats: {
        mass: '0.8 Earth masses',
        radius: '0.9 Earth radii',
        temperature: '450 K',
        distance: '67 light years'
      }
    }
  ];

  // Auto-change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredDiscoveries = discoveries.filter(discovery =>
    discovery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discovery.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filteredDiscoveries.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + filteredDiscoveries.length) % filteredDiscoveries.length);
  };

  const currentDiscovery = filteredDiscoveries[currentCard];

  return (
    <div className="discovery-cards page-container">
      <div className="discovery-header">
        <h1 className="page-title">Exoplanet Discovery Cards</h1>
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

      {filteredDiscoveries.length > 0 && currentDiscovery && (
        <div className="card-container">
          <div className="discovery-card">
            <div className="card-image">
              <img 
                src={currentDiscovery.images[currentImageIndex]} 
                alt={currentDiscovery.name}
                key={currentImageIndex}
                className="auto-changing-image"
              />
              <div className="card-overlay"></div>
              <div className="confidence-badge">
                {Math.round(currentDiscovery.confidence * 100)}%
              </div>
              <div className="image-indicators">
                {currentDiscovery.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="card-3d-planet">
              <div className="discovery-planet-placeholder" style={{ height: '250px' }}>
                <div className="planet-visualization large">
                  <div className={`planet-sphere ${currentDiscovery.type === 'Gas Giant' ? 'gas-giant' : 
                                 currentDiscovery.type === 'Super-Earth' ? 'terrestrial' : 'ice-giant'} atmosphere`} 
                       style={{ backgroundColor: currentDiscovery.type === 'Super-Earth' ? '#81c784' : 
                                               currentDiscovery.type === 'Gas Giant' ? '#ffb74d' : '#4fc3f7' }}></div>
                  {currentDiscovery.type === 'Gas Giant' && <div className="planet-rings"></div>}
                  <div className="planet-atmosphere"></div>
                </div>
                <div className="planet-label">{currentDiscovery.name}</div>
              </div>
            </div>
            
            <div className="card-content">
              <div className="card-header">
                <h2 className="discovery-name">{currentDiscovery.name}</h2>
                <span className="discovery-type">{currentDiscovery.type}</span>
              </div>
              
              <p className="discovery-description">{currentDiscovery.description}</p>
              
              <div className="discovery-stats">
                <div className="stat-item">
                  <span className="stat-label">Mass</span>
                  <span className="stat-value">{currentDiscovery.stats.mass}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Radius</span>
                  <span className="stat-value">{currentDiscovery.stats.radius}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Temperature</span>
                  <span className="stat-value">{currentDiscovery.stats.temperature}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Distance</span>
                  <span className="stat-value">{currentDiscovery.stats.distance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-navigation">
            <button className="nav-btn" onClick={prevCard} disabled={filteredDiscoveries.length <= 1}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="card-indicators">
              {filteredDiscoveries.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentCard ? 'active' : ''}`}
                  onClick={() => setCurrentCard(index)}
                />
              ))}
            </div>
            
            <button className="nav-btn" onClick={nextCard} disabled={filteredDiscoveries.length <= 1}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {filteredDiscoveries.length === 0 && (
        <div className="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h3>No discoveries found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryCards;