import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const currentLocation = useLocation();
  
  // Helper function to check if nav item is active
  const isActiveRoute = (path) => {
    return currentLocation.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="app-logo">
            <div className="logo-icon">
              {/* Custom planet icon - represents exoplanet discovery */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="6" fill="currentColor"/>
                <circle cx="12" cy="12" r="2" fill="var(--primary-bg)"/>
              </svg>
            </div>
            <span className="app-title">Nexa</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className={isActiveRoute('/')}>
            Home
          </Link>
          <Link to="/catalog" className={isActiveRoute('/catalog')}>
            Catalog
          </Link>
          <Link to="/discovery" className={isActiveRoute('/discovery')}>
            Discovery
          </Link>
          <Link to="/interactive" className={isActiveRoute('/interactive')}>
            Interactive
          </Link>
          <Link to="/simulator" className={isActiveRoute('/simulator')}>
            Simulator
          </Link>
          <Link to="/missions" className={isActiveRoute('/missions')}>
            Missions
          </Link>
        </nav>
        
        <div className="header-right">
          <Link to="/interactive" className="cta-btn">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;