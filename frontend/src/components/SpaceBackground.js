import React from 'react';
import './SpaceBackground.css';

const SpaceBackground = () => {
  return (
    <div className="space-background">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

export default SpaceBackground;