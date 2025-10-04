import React, { useState } from 'react';
import './MissionLog.css';

const MissionLog = () => {
  const [selectedMission, setSelectedMission] = useState('kepler');
  const [searchTerm, setSearchTerm] = useState('');

  const missions = {
    kepler: {
      name: 'Kepler Space Telescope',
      status: 'Completed',
      duration: '2009-2018',
      discoveries: 2662,
      description: 'The Kepler mission revolutionized exoplanet science by discovering thousands of planets using the transit method.',
      achievements: [
        'Discovered over 2,600 confirmed exoplanets',
        'Found the first Earth-size planets in habitable zones',
        'Revealed that small planets are more common than large ones',
        'Established that most stars have planetary systems'
      ]
    },
    tess: {
      name: 'TESS (Transiting Exoplanet Survey Satellite)',
      status: 'Active',
      duration: '2018-Present',
      discoveries: 5000,
      description: 'TESS is surveying the entire sky to find exoplanets around the brightest stars near Earth.',
      achievements: [
        'Surveying 200,000+ of the brightest stars',
        'Discovered over 5,000 planet candidates',
        'Found planets suitable for atmospheric studies',
        'Enabling follow-up observations with James Webb'
      ]
    },
    k2: {
      name: 'K2 Extended Mission',
      status: 'Completed',
      duration: '2014-2018',
      discoveries: 500,
      description: 'After Kepler\'s reaction wheels failed, K2 continued the search using a modified observing strategy.',
      achievements: [
        'Extended Kepler\'s legacy with 500+ new planets',
        'Observed diverse stellar populations',
        'Studied young planetary systems',
        'Pioneered new observation techniques'
      ]
    },
    plato: {
      name: 'PLATO (PLAnetary Transits and Oscillations)',
      status: 'Planned',
      duration: '2026-2032',
      discoveries: 0,
      description: 'ESA\'s upcoming mission will search for Earth-like planets around Sun-like stars.',
      achievements: [
        'Will search for Earth analogs',
        'Study stellar oscillations for precise ages',
        'Observe up to 1 million stars',
        'Characterize planetary atmospheres'
      ]
    }
  };

  const logEntries = [
    {
      id: 1,
      date: '2025-10-05',
      mission: 'TESS',
      type: 'Discovery',
      title: 'TOI-715 b Confirmed',
      description: 'Super-Earth confirmed in habitable zone of nearby red dwarf star.',
      confidence: 97.8,
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-10-04',
      mission: 'TESS',
      type: 'Candidate',
      title: 'TOI-2109 b Analysis',
      description: 'Ultra-hot Jupiter with extreme temperatures detected.',
      confidence: 89.2,
      status: 'candidate'
    },
    {
      id: 3,
      date: '2025-10-03',
      mission: 'Kepler',
      type: 'Archive',
      title: 'Kepler-442b Reanalysis',
      description: 'Updated analysis confirms habitability potential.',
      confidence: 94.5,
      status: 'confirmed'
    },
    {
      id: 4,
      date: '2025-10-02',
      mission: 'K2',
      type: 'Discovery',
      title: 'K2-138 System',
      description: 'Multi-planet system with resonant chain discovered.',
      confidence: 92.1,
      status: 'confirmed'
    }
  ];

  const filteredEntries = logEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'var(--success)';
      case 'candidate': return 'var(--warning)';
      case 'false-positive': return 'var(--error)';
      default: return 'var(--secondary-text)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Discovery':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
        );
      case 'Candidate':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Archive':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mission-log page-container">
      <div className="log-header">
        <h1 className="page-title">Mission Log</h1>
        <button className="export-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 5V15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="mission-selector">
        <h3>Active Missions</h3>
        <div className="mission-tabs">
          {Object.entries(missions).map(([key, mission]) => (
            <button
              key={key}
              className={`mission-tab ${selectedMission === key ? 'active' : ''}`}
              onClick={() => setSelectedMission(key)}
            >
              <div className="tab-name">{mission.name.split(' ')[0]}</div>
              <div className="tab-status" style={{ color: mission.status === 'Active' ? 'var(--success)' : mission.status === 'Planned' ? 'var(--warning)' : 'var(--secondary-text)' }}>
                {mission.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mission-details">
        <div className="mission-card">
          <div className="mission-header">
            <h3>{missions[selectedMission].name}</h3>
            <div className="mission-stats">
              <span className="stat">
                <strong>{missions[selectedMission].discoveries.toLocaleString()}</strong> discoveries
              </span>
              <span className="stat">
                <strong>{missions[selectedMission].duration}</strong>
              </span>
            </div>
          </div>
          
          <p className="mission-description">{missions[selectedMission].description}</p>
          
          <div className="achievements">
            <h4>Key Achievements</h4>
            <ul>
              {missions[selectedMission].achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="log-section">
        <div className="log-controls">
          <h3>Discovery Log</h3>
          <div className="search-bar">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search discoveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="log-entries">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="log-entry">
              <div className="entry-header">
                <div className="entry-type">
                  <div className="type-icon" style={{ color: getStatusColor(entry.status) }}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <span className="type-label">{entry.type}</span>
                </div>
                <div className="entry-date">{entry.date}</div>
              </div>
              
              <div className="entry-content">
                <div className="entry-mission">{entry.mission}</div>
                <h4 className="entry-title">{entry.title}</h4>
                <p className="entry-description">{entry.description}</p>
                
                <div className="entry-footer">
                  <div className="confidence-indicator">
                    <span className="confidence-label">Confidence:</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${entry.confidence}%`,
                          backgroundColor: getStatusColor(entry.status)
                        }}
                      ></div>
                    </div>
                    <span className="confidence-value">{entry.confidence}%</span>
                  </div>
                  
                  <div className="entry-status" style={{ color: getStatusColor(entry.status) }}>
                    {entry.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="no-entries">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No log entries found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionLog;