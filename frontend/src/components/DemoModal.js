import React, { useState } from 'react';
import './DemoModal.css';

const DemoModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome to Exoplanet Lab",
      description: "Discover distant worlds using AI-powered analysis and interactive 3D visualizations.",
      component: (
        <div className="demo-planet-placeholder" style={{ height: '300px' }}>
          <div className="planet-visualization">
            <div className="planet-sphere terrestrial"></div>
            <div className="planet-atmosphere"></div>
          </div>
          <p>Interactive 3D Planet Visualization</p>
        </div>
      )
    },
    {
      title: "Light Curve Analysis",
      description: "Upload stellar brightness data and let our AI detect planetary transits with high precision.",
      component: (
        <div className="demo-chart">
          <svg width="100%" height="200" viewBox="0 0 300 200">
            <path
              d="M 0 100 L 50 100 L 100 100 L 120 120 L 140 120 L 160 100 L 300 100"
              fill="none"
              stroke="var(--teal-light)"
              strokeWidth="3"
            />
            <circle cx="130" cy="120" r="4" fill="var(--warning)">
              <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="135" y="115" fill="var(--warning)" fontSize="12">Transit Detected</text>
          </svg>
        </div>
      )
    },
    {
      title: "3D Exploration",
      description: "Explore exoplanetary systems in immersive 3D environments with real-time orbital mechanics.",
      component: (
        <div className="demo-features">
          <div className="feature-item">
            <div className="feature-icon">🌍</div>
            <span>Interactive Planets</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔭</div>
            <span>Transit Simulation</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <span>AI Analysis</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <span>Data Visualization</span>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="demo-header">
          <h2>{demoSteps[currentStep].title}</h2>
          <button className="demo-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div className="demo-content">
          <div className="demo-visual">
            {demoSteps[currentStep].component}
          </div>
          
          <p className="demo-description">
            {demoSteps[currentStep].description}
          </p>
        </div>
        
        <div className="demo-navigation">
          <button 
            className="demo-btn secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          
          <div className="demo-indicators">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                className={`demo-indicator ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          
          <button 
            className="demo-btn primary" 
            onClick={nextStep}
          >
            {currentStep === demoSteps.length - 1 ? 'Start Exploring' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;