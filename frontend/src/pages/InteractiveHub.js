import React, { useState } from 'react';
import InteractiveStory from '../components/InteractiveStory';
import ExoplanetHunt from '../components/ExoplanetHunt';
import StarExplorer from '../components/StarExplorer';
import Advanced3DSolarSystem from '../components/Advanced3DSolarSystem';
import './InteractiveHub.css';

const InteractiveHub = () => {
  const [activeExperience, setActiveExperience] = useState(null);
  const [userProgress, setUserProgress] = useState({
    storyCompleted: false,
    huntHighScore: 0,
    planetsDiscovered: 0,
    systemsExplored: 0
  });

  const experiences = [
    {
      id: 'story',
      title: 'Discovery Journey',
      subtitle: 'Interactive Storytelling',
      description: 'Experience the thrilling process of discovering your first exoplanet through an immersive, choice-driven narrative.',
      icon: '📖',
      difficulty: 'Beginner',
      duration: '15-20 min',
      features: ['Branching storylines', 'Scientific accuracy', '3D visualizations', 'Educational content'],
      component: InteractiveStory
    },
    {
      id: 'hunt',
      title: 'Exoplanet Hunt Challenge',
      subtitle: 'Gamified Detection',
      description: 'Test your observational skills in this exciting game where you detect exoplanets using real astronomical methods.',
      icon: '🎯',
      difficulty: 'Intermediate',
      duration: '10-15 min',
      features: ['Real-time detection', 'Scoring system', 'Multiple levels', 'Achievement system'],
      component: ExoplanetHunt
    },
    {
      id: 'explorer',
      title: 'Star System Explorer',
      subtitle: '3D Interactive Map',
      description: 'Navigate through space and explore real exoplanetary systems with detailed 3D visualizations and scientific data.',
      icon: '🗺️',
      difficulty: 'Advanced',
      duration: '20-30 min',
      features: ['Interactive star map', '3D planet models', 'Real astronomical data', 'System comparisons'],
      component: StarExplorer
    }
  ];

  const achievements = [
    {
      id: 'first-discovery',
      title: 'First Discovery',
      description: 'Complete your first exoplanet discovery story',
      icon: '🌟',
      unlocked: userProgress.storyCompleted
    },
    {
      id: 'planet-hunter',
      title: 'Planet Hunter',
      description: 'Discover 10 planets in the hunt challenge',
      icon: '🏆',
      unlocked: userProgress.planetsDiscovered >= 10
    },
    {
      id: 'system-explorer',
      title: 'System Explorer',
      description: 'Explore 5 different star systems',
      icon: '🚀',
      unlocked: userProgress.systemsExplored >= 5
    },
    {
      id: 'high-scorer',
      title: 'High Scorer',
      description: 'Achieve a score of 5000+ in the hunt challenge',
      icon: '⭐',
      unlocked: userProgress.huntHighScore >= 5000
    }
  ];

  const handleExperienceComplete = (experienceId, data) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      
      switch (experienceId) {
        case 'story':
          newProgress.storyCompleted = true;
          break;
        case 'hunt':
          if (data.score > prev.huntHighScore) {
            newProgress.huntHighScore = data.score;
          }
          newProgress.planetsDiscovered += data.planetsFound || 0;
          break;
        case 'explorer':
          newProgress.systemsExplored += 1;
          break;
        default:
          // No action needed for unknown experience types
          break;
      }
      
      return newProgress;
    });
  };

  return (
    <div className="interactive-hub">
      <div className="hub-header">
        <h1>🌌 Interactive Exoplanet Hub</h1>
        <p>Embark on immersive journeys through space and discover the wonders of exoplanets</p>
      </div>

      <div className="hub-stats">
        <div className="stat-card">
          <div className="stat-number">{userProgress.planetsDiscovered}</div>
          <div className="stat-label">Planets Discovered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userProgress.systemsExplored}</div>
          <div className="stat-label">Systems Explored</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userProgress.huntHighScore.toLocaleString()}</div>
          <div className="stat-label">Best Hunt Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{achievements.filter(a => a.unlocked).length}</div>
          <div className="stat-label">Achievements</div>
        </div>
      </div>

      <div className="featured-experience">
        <h2>🎮 Featured Experience</h2>
        <div className="featured-card">
          <div className="featured-visual">
            <Advanced3DSolarSystem style={{ height: '300px' }} />
          </div>
          <div className="featured-content">
            <h3>Interactive Solar System</h3>
            <p>
              Explore a fully interactive 3D solar system with realistic planetary orbits, 
              moons, and ring systems. Drag to rotate the view and watch planets move in 
              real-time with accurate orbital mechanics.
            </p>
            <div className="featured-features">
              <span className="feature-tag">3D Visualization</span>
              <span className="feature-tag">Real Physics</span>
              <span className="feature-tag">Interactive Controls</span>
            </div>
          </div>
        </div>
      </div>

      <div className="experiences-section">
        <h2>🚀 Choose Your Adventure</h2>
        <div className="experiences-grid">
          {experiences.map(experience => (
            <div key={experience.id} className="experience-card-detailed">
              <div className="card-header">
                <div className="card-icon">{experience.icon}</div>
                <div className="card-badges">
                  <span className={`difficulty-badge ${experience.difficulty.toLowerCase()}`}>
                    {experience.difficulty}
                  </span>
                  <span className="duration-badge">{experience.duration}</span>
                </div>
              </div>
              
              <div className="card-content">
                <h3>{experience.title}</h3>
                <h4>{experience.subtitle}</h4>
                <p>{experience.description}</p>
                
                <div className="features-list">
                  <h5>Features:</h5>
                  <ul>
                    {experience.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="launch-btn"
                  onClick={() => setActiveExperience(experience.id)}
                >
                  Launch Experience
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>🏆 Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="unlocked-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render active experience */}
      {activeExperience === 'story' && (
        <InteractiveStory 
          isOpen={true} 
          onClose={() => {
            setActiveExperience(null);
            handleExperienceComplete('story', {});
          }} 
        />
      )}
      
      {activeExperience === 'hunt' && (
        <ExoplanetHunt 
          isOpen={true} 
          onClose={(data) => {
            setActiveExperience(null);
            if (data) handleExperienceComplete('hunt', data);
          }} 
        />
      )}
      
      {activeExperience === 'explorer' && (
        <StarExplorer 
          isOpen={true} 
          onClose={() => {
            setActiveExperience(null);
            handleExperienceComplete('explorer', {});
          }} 
        />
      )}
    </div>
  );
};

export default InteractiveHub;