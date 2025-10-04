import React, { useState } from 'react';
import Advanced3DSolarSystem from './Advanced3DSolarSystem';
import './InteractiveStory.css';

const InteractiveStory = ({ isOpen, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setUserChoices] = useState({});

  const storyChapters = [
    {
      id: 'intro',
      title: 'The Discovery Begins',
      subtitle: 'Kepler Space Telescope - 2023',
      content: 'You are Dr. Sarah Chen, an astrophysicist analyzing data from the Kepler Space Telescope. Tonight, something unusual catches your attention in the light curve of star HD 40307...',
      visual: (
        <div className="story-visual telescope-view">
          <div className="telescope-interface">
            <div className="data-stream">
              <div className="light-curve">
                <svg width="100%" height="120" viewBox="0 0 400 120">
                  <path
                    d="M 0 60 L 80 60 L 100 60 L 120 75 L 140 75 L 160 60 L 400 60"
                    fill="none"
                    stroke="#4dd0e1"
                    strokeWidth="2"
                  />
                  <circle cx="130" cy="75" r="3" fill="#ff6b35">
                    <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x="135" y="70" fill="#ff6b35" fontSize="10">Anomaly Detected</text>
                </svg>
              </div>
              <div className="data-readout">
                <div className="readout-line">Brightness: 98.7% → 97.2% → 98.7%</div>
                <div className="readout-line">Duration: 3.2 hours</div>
                <div className="readout-line">Periodicity: Every 28.1 days</div>
              </div>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Investigate the anomaly further', next: 'analysis' },
        { text: 'Mark as instrumental error', next: 'error' }
      ]
    },
    {
      id: 'analysis',
      title: 'Deep Analysis',
      subtitle: 'The Plot Thickens',
      content: 'Your instincts were right! The periodic dimming suggests a planet transiting in front of HD 40307. But this is no ordinary planet - the data suggests it might be in the habitable zone!',
      visual: (
        <div className="story-visual analysis-view">
          <div className="story-planet-placeholder" style={{ height: '200px' }}>
            <div className="planet-visualization">
              <div className="planet-sphere terrestrial habitable"></div>
              <div className="planet-atmosphere"></div>
            </div>
            <div className="planet-label">HD 40307g - Potentially Habitable</div>
          </div>
          <div className="analysis-data">
            <div className="data-point">
              <span className="label">Planet Radius:</span>
              <span className="value">1.4 Earth Radii</span>
            </div>
            <div className="data-point">
              <span className="label">Orbital Period:</span>
              <span className="value">28.1 days</span>
            </div>
            <div className="data-point">
              <span className="label">Distance from Star:</span>
              <span className="value">0.6 AU</span>
            </div>
            <div className="data-point highlight">
              <span className="label">Habitable Zone:</span>
              <span className="value">✓ CONFIRMED</span>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Submit for peer review', next: 'review' },
        { text: 'Gather more data first', next: 'moredata' }
      ]
    },
    {
      id: 'error',
      title: 'Second Thoughts',
      subtitle: 'A Missed Opportunity?',
      content: 'You marked it as an error, but something keeps nagging at you. Three weeks later, you decide to take another look at the data...',
      visual: (
        <div className="story-visual regret-view">
          <div className="computer-screen">
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">Data marked as instrumental error</div>
              <div className="error-subtext">HD 40307 - Periodic dimming events</div>
            </div>
            <button className="reanalyze-btn">Re-analyze Data</button>
          </div>
        </div>
      ),
      choices: [
        { text: 'Re-analyze the data', next: 'analysis' },
        { text: 'Move on to other projects', next: 'missed' }
      ]
    },
    {
      id: 'review',
      title: 'Peer Review Success',
      subtitle: 'The Scientific Community Responds',
      content: 'Your paper is accepted! The exoplanet HD 40307g is confirmed as a potentially habitable super-Earth. But now comes the real challenge - how do we study it further?',
      visual: (
        <div className="story-visual success-view">
          <div className="publication-mockup">
            <div className="journal-header">Nature Astronomy</div>
            <div className="paper-title">Discovery of HD 40307g: A Potentially Habitable Super-Earth</div>
            <div className="authors">S. Chen, et al.</div>
            <div className="abstract">
              We report the discovery of HD 40307g, a 1.4 Earth-radius planet orbiting within the habitable zone of its host star...
            </div>
          </div>
          <div className="media-attention">
            <div className="headline">🌍 New Earth-like Planet Discovered!</div>
            <div className="headline">🔬 Could This Planet Harbor Life?</div>
            <div className="headline">🚀 Next Target for Space Missions?</div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Propose follow-up observations', next: 'followup' },
        { text: 'Search for more planets in the system', next: 'system' }
      ]
    },
    {
      id: 'system',
      title: 'A Planetary System Revealed',
      subtitle: 'More Worlds Await',
      content: 'Your continued observations reveal that HD 40307g is not alone! You\'ve discovered a complex planetary system with multiple worlds, each with its own story to tell.',
      visual: (
        <div className="story-visual system-view">
          <Advanced3DSolarSystem style={{ height: '300px' }} />
          <div className="system-info">
            <div className="planet-count">
              <span className="number">6</span>
              <span className="label">Confirmed Planets</span>
            </div>
            <div className="planet-count">
              <span className="number">2</span>
              <span className="label">In Habitable Zone</span>
            </div>
            <div className="planet-count">
              <span className="number">1</span>
              <span className="label">Potentially Earth-like</span>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Focus on the habitable worlds', next: 'habitable' },
        { text: 'Study the entire system', next: 'complete' }
      ]
    },
    {
      id: 'habitable',
      title: 'The Search for Life',
      subtitle: 'Atmospheric Analysis',
      content: 'Using next-generation telescopes, you begin analyzing the atmospheres of the habitable zone planets. The spectroscopic data reveals something extraordinary...',
      visual: (
        <div className="story-visual atmosphere-view">
          <div className="story-planet-placeholder" style={{ height: '200px' }}>
            <div className="planet-visualization">
              <div className="planet-sphere terrestrial atmosphere-rich"></div>
              <div className="planet-atmosphere thick"></div>
            </div>
            <div className="planet-label">Atmospheric Analysis View</div>
          </div>
          <div className="spectrum-analysis">
            <div className="spectrum-title">Atmospheric Composition</div>
            <div className="spectrum-bar">
              <div className="gas-component" style={{width: '60%', backgroundColor: '#81c784'}}>
                <span>N₂ (60%)</span>
              </div>
              <div className="gas-component" style={{width: '20%', backgroundColor: '#4fc3f7'}}>
                <span>O₂ (20%)</span>
              </div>
              <div className="gas-component" style={{width: '15%', backgroundColor: '#ffb74d'}}>
                <span>Ar (15%)</span>
              </div>
              <div className="gas-component" style={{width: '5%', backgroundColor: '#ff6b35'}}>
                <span>H₂O (5%)</span>
              </div>
            </div>
            <div className="biosignature">
              <span className="biosig-label">Potential Biosignature:</span>
              <span className="biosig-value">O₂ + H₂O detected! 🌱</span>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Announce the potential biosignature', next: 'biosignature' },
        { text: 'Gather more evidence first', next: 'evidence' }
      ]
    },
    {
      id: 'biosignature',
      title: 'A Historic Announcement',
      subtitle: 'Potential Signs of Life',
      content: 'Your team announces the detection of potential biosignatures in the atmosphere of HD 40307g. The world watches as humanity takes its first tentative step toward answering the age-old question: Are we alone?',
      visual: (
        <div className="story-visual announcement-view">
          <div className="press-conference">
            <div className="podium">
              <div className="speaker">Dr. Sarah Chen</div>
              <div className="announcement-text">
                "Today, we announce the detection of oxygen and water vapor in the atmosphere of HD 40307g, 
                potentially indicating biological processes..."
              </div>
            </div>
            <div className="global-reaction">
              <div className="reaction-item">🌍 Global excitement</div>
              <div className="reaction-item">🔬 Scientific validation</div>
              <div className="reaction-item">🚀 Mission planning begins</div>
              <div className="reaction-item">👽 The search continues</div>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Continue the search for more worlds', next: 'legacy' },
        { text: 'Focus on mission planning', next: 'mission' }
      ]
    },
    {
      id: 'legacy',
      title: 'Your Legacy',
      subtitle: 'The Journey Continues',
      content: 'Your discovery has opened a new chapter in human understanding. HD 40307g becomes the first confirmed potentially habitable exoplanet with biosignatures, inspiring a new generation of explorers and scientists.',
      visual: (
        <div className="story-visual legacy-view">
          <div className="timeline">
            <div className="timeline-item">
              <div className="year">2023</div>
              <div className="event">Discovery of HD 40307g</div>
            </div>
            <div className="timeline-item">
              <div className="year">2024</div>
              <div className="event">Biosignature detection</div>
            </div>
            <div className="timeline-item">
              <div className="year">2030</div>
              <div className="event">Interstellar probe mission</div>
            </div>
            <div className="timeline-item">
              <div className="year">2055</div>
              <div className="event">First detailed images</div>
            </div>
          </div>
          <div className="impact-stats">
            <div className="stat">
              <span className="stat-number">1,247</span>
              <span className="stat-label">Follow-up discoveries</span>
            </div>
            <div className="stat">
              <span className="stat-number">23</span>
              <span className="stat-label">Potentially habitable worlds</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities ahead</span>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Start a new discovery journey', next: 'restart' },
        { text: 'Explore the exoplanet catalog', next: 'catalog' }
      ]
    }
  ];

  const getCurrentChapter = () => {
    return storyChapters.find(chapter => chapter.id === currentChapter) || storyChapters[0];
  };

  const handleChoice = (choice) => {
    setIsAnimating(true);
    setUserChoices(prev => ({
      ...prev,
      [currentChapter]: choice.text
    }));
    
    setTimeout(() => {
      if (choice.next === 'restart') {
        setCurrentChapter(0);
        setUserChoices({});
      } else if (choice.next === 'catalog') {
        onClose();
        // Navigate to catalog
        window.location.href = '/catalog';
      } else {
        const nextChapter = storyChapters.findIndex(ch => ch.id === choice.next);
        setCurrentChapter(nextChapter >= 0 ? nextChapter : 0);
      }
      setIsAnimating(false);
    }, 500);
  };

  const chapter = getCurrentChapter();

  if (!isOpen) return null;

  return (
    <div className="interactive-story-overlay">
      <div className="interactive-story-modal">
        <div className="story-header">
          <div className="story-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentChapter + 1) / storyChapters.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              Chapter {currentChapter + 1} of {storyChapters.length}
            </span>
          </div>
          <button className="story-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className={`story-content ${isAnimating ? 'animating' : ''}`}>
          <div className="story-text-section">
            <h2 className="story-title">{chapter.title}</h2>
            <h3 className="story-subtitle">{chapter.subtitle}</h3>
            <p className="story-content-text">{chapter.content}</p>
          </div>

          <div className="story-visual-section">
            {chapter.visual}
          </div>

          <div className="story-choices">
            {chapter.choices.map((choice, index) => (
              <button
                key={index}
                className="story-choice-btn"
                onClick={() => handleChoice(choice)}
                disabled={isAnimating}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveStory;