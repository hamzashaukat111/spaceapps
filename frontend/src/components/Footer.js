import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>NASA Exoplanet Discovery</h3>
          <p>Exploring the cosmos and discovering new worlds beyond our solar system.</p>
          <div className="social-links">
            <a href="https://twitter.com/nasa" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="https://facebook.com/nasa" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com/nasa" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/catalog">Exoplanet Catalog</a></li>
            <li><a href="/discovery">Discovery Cards</a></li>
            <li><a href="/simulator">Transit Simulator</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Learn</h4>
          <ul>
            <li><a href="/interactive">Interactive Hub</a></li>
            <li><a href="/missions">Mission Log</a></li>
            <li><a href="/explorer">Light Curve Explorer</a></li>
            <li><a href="https://exoplanets.nasa.gov/resources/">Educational Resources</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://nasa.gov/about/">About NASA</a></li>
            <li><a href="https://nasa.gov/contact/">Contact Us</a></li>
            <li><a href="https://nasa.gov/privacy/">Privacy Policy</a></li>
            <li><a href="https://nasa.gov/terms/">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 NASA Exoplanet Discovery. All rights reserved.</p>
          <p>Powered by NASA's Exoplanet Archive and Kepler Mission Data</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;