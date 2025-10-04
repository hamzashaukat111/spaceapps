import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Explore',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      )
    },
    {
      path: '/catalog',
      label: 'Catalog',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
          <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
      )
    },
    {
      path: '/explorer',
      label: 'Light Curve',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L7 8L12 12L17 6L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 4V10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      path: '/missions',
      label: 'Mission Log',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      path: '/discovery',
      label: 'Cards',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      path: '/interactive',
      label: 'Interactive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="9" r="2" fill="currentColor"/>
          <circle cx="16" cy="9" r="2" fill="currentColor"/>
          <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-items">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="nav-icon">
              {item.icon}
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;