import React, { useState, useEffect, useRef } from 'react';
import './ExoplanetHunt.css';

const ExoplanetHunt = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [discoveries, setDiscoveries] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [gameStats, setGameStats] = useState({
    planetsFound: 0,
    accuracy: 0,
    totalClicks: 0,
    correctClicks: 0
  });
  
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const starsRef = useRef([]);
  const planetsRef = useRef([]);

  // Game configuration
  const gameConfig = {
    starsCount: 50 + (level * 10),
    planetsPerLevel: 3 + level,
    timePerLevel: 60,
    pointsPerPlanet: 100 * level,
    difficultyMultiplier: level * 0.2
  };

  useEffect(() => {
    if (gameState === 'playing') {
      initializeGame();
      startGameLoop();
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameState]);

  const initializeGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Generate stars
    starsRef.current = [];
    for (let i = 0; i < gameConfig.starsCount; i++) {
      starsRef.current.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        brightness: Math.random() * 0.8 + 0.2,
        baseRadius: Math.random() * 3 + 1,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        hasPlanet: false,
        planetData: null
      });
    }

    // Add planets to random stars
    const starsWithPlanets = starsRef.current
      .sort(() => Math.random() - 0.5)
      .slice(0, gameConfig.planetsPerLevel);

    starsWithPlanets.forEach((star, index) => {
      star.hasPlanet = true;
      star.planetData = {
        id: `planet_${index}`,
        transitPeriod: Math.random() * 5 + 2, // 2-7 seconds
        transitDuration: 0.3 + Math.random() * 0.4, // 0.3-0.7 seconds
        transitDepth: 0.1 + Math.random() * 0.2, // 10-30% brightness drop
        lastTransit: Date.now(),
        isTransiting: false,
        discovered: false,
        type: ['Rocky', 'Gas Giant', 'Super-Earth', 'Ice Giant'][Math.floor(Math.random() * 4)],
        size: Math.random() * 2 + 0.5
      };
    });

    planetsRef.current = starsWithPlanets.map(star => star.planetData);
    setCurrentTarget(planetsRef.current[0]);
  };

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationTime = 0;

    const animate = (timestamp) => {
      animationTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach(star => {
        // Update planet transits
        if (star.hasPlanet && star.planetData) {
          const planet = star.planetData;
          const timeSinceLastTransit = (Date.now() - planet.lastTransit) / 1000;
          
          if (timeSinceLastTransit >= planet.transitPeriod) {
            planet.lastTransit = Date.now();
            planet.isTransiting = true;
            setTimeout(() => {
              planet.isTransiting = false;
            }, planet.transitDuration * 1000);
          }
        }

        // Calculate star appearance
        const twinkle = Math.sin(animationTime * star.twinkleSpeed + star.twinklePhase);
        let currentBrightness = star.brightness + twinkle * 0.1;
        let currentRadius = star.baseRadius;

        // Apply transit effect
        if (star.hasPlanet && star.planetData && star.planetData.isTransiting) {
          currentBrightness *= (1 - star.planetData.transitDepth);
          currentRadius *= 0.9; // Slight size reduction during transit
        }

        // Draw star
        ctx.save();
        ctx.globalAlpha = currentBrightness;
        
        // Star color based on whether it has a planet
        const starColor = star.hasPlanet ? '#ffeb3b' : '#ffffff';
        ctx.fillStyle = starColor;
        ctx.shadowBlur = currentRadius * 2;
        ctx.shadowColor = starColor;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add discovery indicator
        if (star.hasPlanet && star.planetData && star.planetData.discovered) {
          ctx.strokeStyle = '#4caf50';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentRadius + 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });

      // Draw UI elements
      drawGameUI(ctx);

      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(animate);
      }
    };

    gameLoopRef.current = requestAnimationFrame(animate);
  };

  const drawGameUI = (ctx) => {
    const canvas = canvasRef.current;
    
    // Draw crosshair cursor
    ctx.strokeStyle = 'rgba(77, 208, 225, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw target info
    if (currentTarget) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 250, 80);
      
      ctx.fillStyle = '#4dd0e1';
      ctx.font = '14px Arial';
      ctx.fillText(`Target: ${currentTarget.type} Planet`, 20, 30);
      ctx.fillText(`Transit Period: ${currentTarget.transitPeriod.toFixed(1)}s`, 20, 50);
      ctx.fillText(`Transit Depth: ${(currentTarget.transitDepth * 100).toFixed(1)}%`, 20, 70);
    }
  };

  const handleCanvasClick = (event) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    setGameStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1
    }));

    // Check if click is on a star
    const clickedStar = starsRef.current.find(star => {
      const distance = Math.sqrt(
        Math.pow(clickX - star.x, 2) + Math.pow(clickY - star.y, 2)
      );
      return distance <= star.baseRadius + 10; // 10px tolerance
    });

    if (clickedStar && clickedStar.hasPlanet && !clickedStar.planetData.discovered) {
      // Successful discovery!
      clickedStar.planetData.discovered = true;
      
      const points = gameConfig.pointsPerPlanet;
      setScore(prev => prev + points);
      setDiscoveries(prev => [...prev, {
        id: clickedStar.planetData.id,
        type: clickedStar.planetData.type,
        points: points,
        timestamp: Date.now()
      }]);

      setGameStats(prev => ({
        ...prev,
        planetsFound: prev.planetsFound + 1,
        correctClicks: prev.correctClicks + 1
      }));

      // Move to next target
      const remainingPlanets = planetsRef.current.filter(p => !p.discovered);
      if (remainingPlanets.length > 0) {
        setCurrentTarget(remainingPlanets[0]);
      } else {
        // Level complete!
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setTimeLeft(gameConfig.timePerLevel);
        }, 1000);
      }
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTimeLeft(gameConfig.timePerLevel);
    setDiscoveries([]);
    setGameStats({
      planetsFound: 0,
      accuracy: 0,
      totalClicks: 0,
      correctClicks: 0
    });
  };

  const endGame = () => {
    setGameState('results');
    const accuracy = gameStats.totalClicks > 0 ? 
      (gameStats.correctClicks / gameStats.totalClicks * 100) : 0;
    setGameStats(prev => ({ ...prev, accuracy }));
  };

  const resetGame = () => {
    setGameState('menu');
  };

  if (!isOpen) return null;

  return (
    <div className="exoplanet-hunt-overlay">
      <div className="exoplanet-hunt-modal">
        {gameState === 'menu' && (
          <div className="hunt-menu">
            <div className="hunt-header">
              <h2>🔭 Exoplanet Hunt Challenge</h2>
              <button className="hunt-close" onClick={onClose}>×</button>
            </div>
            
            <div className="hunt-instructions">
              <h3>Mission Briefing</h3>
              <p>
                You are an astronomer searching for exoplanets using the transit method. 
                Watch for stars that dim periodically as planets pass in front of them.
              </p>
              
              <div className="instructions-list">
                <div className="instruction-item">
                  <span className="instruction-icon">👀</span>
                  <span>Watch for stars that dim and brighten periodically</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">🎯</span>
                  <span>Click on stars when you detect a transit</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">⏱️</span>
                  <span>Find all planets before time runs out</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">🏆</span>
                  <span>Earn points for accuracy and speed</span>
                </div>
              </div>
            </div>
            
            <button className="start-hunt-btn" onClick={startGame}>
              Start Hunt
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="hunt-game">
            <div className="hunt-hud">
              <div className="hud-item">
                <span className="hud-label">Score:</span>
                <span className="hud-value">{score.toLocaleString()}</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">Level:</span>
                <span className="hud-value">{level}</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">Time:</span>
                <span className="hud-value">{timeLeft}s</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">Found:</span>
                <span className="hud-value">{gameStats.planetsFound}/{gameConfig.planetsPerLevel}</span>
              </div>
              <button className="hunt-close-game" onClick={onClose}>×</button>
            </div>
            
            <canvas
              ref={canvasRef}
              className="hunt-canvas"
              onClick={handleCanvasClick}
            />
            
            <div className="hunt-discoveries">
              {discoveries.slice(-3).map((discovery, index) => (
                <div key={discovery.id} className="discovery-notification">
                  🎉 Discovered {discovery.type}! +{discovery.points} points
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'results' && (
          <div className="hunt-results">
            <div className="results-header">
              <h2>🏆 Mission Complete!</h2>
              <button className="hunt-close" onClick={onClose}>×</button>
            </div>
            
            <div className="results-stats">
              <div className="stat-card">
                <div className="stat-number">{score.toLocaleString()}</div>
                <div className="stat-label">Total Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{gameStats.planetsFound}</div>
                <div className="stat-label">Planets Discovered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{level}</div>
                <div className="stat-label">Levels Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{gameStats.accuracy.toFixed(1)}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
            
            <div className="results-achievements">
              <h3>Achievements Unlocked</h3>
              <div className="achievements-list">
                {gameStats.planetsFound >= 5 && (
                  <div className="achievement">
                    <span className="achievement-icon">🌟</span>
                    <span>Planet Hunter - Found 5+ planets</span>
                  </div>
                )}
                {gameStats.accuracy >= 80 && (
                  <div className="achievement">
                    <span className="achievement-icon">🎯</span>
                    <span>Sharp Eye - 80%+ accuracy</span>
                  </div>
                )}
                {level >= 3 && (
                  <div className="achievement">
                    <span className="achievement-icon">🚀</span>
                    <span>Explorer - Reached level 3</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="results-actions">
              <button className="play-again-btn" onClick={resetGame}>
                Play Again
              </button>
              <button className="explore-catalog-btn" onClick={() => {
                onClose();
                window.location.href = '/catalog';
              }}>
                Explore Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExoplanetHunt;