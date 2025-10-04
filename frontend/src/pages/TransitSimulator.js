import React, { useState, useEffect } from 'react';
import Advanced3DSolarSystem from '../components/Advanced3DSolarSystem';
import './TransitSimulator.css';

const TransitSimulator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [planetPosition, setPlanetPosition] = useState(0);
  const [parameters, setParameters] = useState({
    planetRadius: 1.0,
    orbitalPeriod: 3.0,
    starRadius: 1.0,
    inclination: 90
  });

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlanetPosition(prev => (prev + 2) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: parseFloat(value)
    }));
  };

  const generateLightCurve = () => {
    const points = [];
    const transitDepth = Math.pow(parameters.planetRadius / parameters.starRadius, 2) * 0.01;
    
    for (let i = 0; i < 100; i++) {
      const phase = (i / 100) * 360;
      let brightness = 1.0;
      
      // Calculate transit
      if (Math.abs(phase - 180) < 20) {
        const transitFactor = 1 - transitDepth * Math.exp(-Math.pow((phase - 180) / 8, 2));
        brightness = transitFactor;
      }
      
      points.push({ phase, brightness });
    }
    return points;
  };

  const lightCurveData = generateLightCurve();

  return (
    <div className="transit-simulator page-container">
      <div className="simulator-header">
        <h1 className="page-title">Transit Simulator & Orbit Visualizer</h1>
        <button className="info-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="story-section">
        <div className="story-card">
          <h3>🌟 Stellar Observatory Mission</h3>
          <p>Welcome to the Exoplanet Transit Laboratory! Adjust the orbital parameters and watch how planetary transits create the characteristic dips in stellar brightness that reveal distant worlds.</p>
        </div>
      </div>

      <div className="orbit-visualizer">
        <h3>3D Orbital Animation</h3>
        <div className="orbit-container">
          <Advanced3DSolarSystem 
            style={{ height: '400px' }}
          />
          
          <div className="orbit-controls">
            <button
              className="play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
              )}
              {isPlaying ? 'Pause Animation' : 'Play Animation'}
            </button>
            
            <button
              className="reset-btn"
              onClick={() => setPlanetPosition(0)}
            >
              ↻ Reset View
            </button>
          </div>
        </div>
      </div>

      <div className="parameters-section">
        <h3>System Parameters</h3>
        <div className="parameter-controls">
          <div className="parameter-group">
            <label>Planet Radius (Earth radii)</label>
            <div className="slider-container">
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={parameters.planetRadius}
                onChange={(e) => handleParameterChange('planetRadius', e.target.value)}
                className="parameter-slider"
              />
              <span className="slider-value">{parameters.planetRadius}</span>
            </div>
          </div>
          
          <div className="parameter-group">
            <label>Orbital Period (days)</label>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={parameters.orbitalPeriod}
                onChange={(e) => handleParameterChange('orbitalPeriod', e.target.value)}
                className="parameter-slider"
              />
              <span className="slider-value">{parameters.orbitalPeriod}</span>
            </div>
          </div>
          
          <div className="parameter-group">
            <label>Star Radius (Solar radii)</label>
            <div className="slider-container">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={parameters.starRadius}
                onChange={(e) => handleParameterChange('starRadius', e.target.value)}
                className="parameter-slider"
              />
              <span className="slider-value">{parameters.starRadius}</span>
            </div>
          </div>
          
          <div className="parameter-group">
            <label>Inclination (degrees)</label>
            <div className="slider-container">
              <input
                type="range"
                min="60"
                max="90"
                step="5"
                value={parameters.inclination}
                onChange={(e) => handleParameterChange('inclination', e.target.value)}
                className="parameter-slider"
              />
              <span className="slider-value">{parameters.inclination}°</span>
            </div>
          </div>
        </div>
      </div>

      <div className="light-curve-section">
        <h3>Generated Light Curve</h3>
        <div className="light-curve-container">
          <div className="curve-header">
            <span>Stellar Brightness vs Orbital Phase</span>
            <div className="transit-info">
              Transit Depth: {(Math.pow(parameters.planetRadius / parameters.starRadius, 2) * 1).toFixed(3)}%
            </div>
          </div>
          
          <div className="curve-chart">
            <svg width="100%" height="150" viewBox="0 0 300 150">
              {/* Grid */}
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1="0" y1={i * 37.5} x2="300" y2={i * 37.5} stroke="rgba(77, 208, 225, 0.1)" strokeWidth="1"/>
              ))}
              
              {/* Light curve */}
              <path
                d={`M ${lightCurveData.map((point, i) => `${i * 3} ${(1 - point.brightness) * 150 + 20}`).join(' L ')}`}
                fill="none"
                stroke="var(--teal-light)"
                strokeWidth="2"
              />
              
              {/* Current position indicator */}
              <line
                x1={planetPosition * 300 / 360}
                y1="0"
                x2={planetPosition * 300 / 360}
                y2="150"
                stroke="var(--warning)"
                strokeWidth="2"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3>🔬 Scientific Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Transit Depth</h4>
            <p>The depth of the transit tells us the size of the planet relative to its star. Larger planets create deeper transits.</p>
          </div>
          
          <div className="insight-card">
            <h4>Orbital Period</h4>
            <p>The time between transits reveals the planet's orbital period and distance from its star.</p>
          </div>
          
          <div className="insight-card">
            <h4>Transit Duration</h4>
            <p>How long the transit lasts depends on the planet's orbital speed and the star's size.</p>
          </div>
          
          <div className="insight-card">
            <h4>Inclination</h4>
            <p>Only planets with orbits aligned with our view (high inclination) will transit their star.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitSimulator;