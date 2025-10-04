import React, { useRef, useEffect, useState } from 'react';
import './Advanced3DSolarSystem.css';

const Advanced3DSolarSystem = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraAngle, setCameraAngle] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resizeCanvas = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D projection functions
    const project3D = (x, y, z, camera) => {
      const distance = 500;
      const rotatedX = x * Math.cos(camera.y) - z * Math.sin(camera.y);
      const rotatedZ = x * Math.sin(camera.y) + z * Math.cos(camera.y);
      
      const rotatedY = y * Math.cos(camera.x) - rotatedZ * Math.sin(camera.x);
      const finalZ = y * Math.sin(camera.x) + rotatedZ * Math.cos(camera.x);
      
      const scale = distance / (distance + finalZ);
      return {
        x: width / 2 + rotatedX * scale,
        y: height / 2 + rotatedY * scale,
        scale: scale,
        z: finalZ
      };
    };

    // Solar system objects
    const solarSystem = {
      star: {
        x: 0, y: 0, z: 0,
        radius: 15,
        color: '#FFD700',
        glowColor: '#FFA500'
      },
      planets: [
        {
          name: 'Mercury',
          orbitRadius: 80,
          radius: 3,
          color: '#8C7853',
          speed: 0.04,
          angle: 0,
          tilt: 0.1
        },
        {
          name: 'Venus',
          orbitRadius: 120,
          radius: 5,
          color: '#FFC649',
          speed: 0.03,
          angle: Math.PI / 3,
          tilt: 0.05
        },
        {
          name: 'Earth',
          orbitRadius: 160,
          radius: 6,
          color: '#6B93D6',
          speed: 0.025,
          angle: Math.PI / 2,
          tilt: 0.08,
          hasRings: false,
          moons: [{ radius: 2, distance: 15, color: '#C0C0C0', speed: 0.1 }]
        },
        {
          name: 'Mars',
          orbitRadius: 200,
          radius: 4,
          color: '#CD5C5C',
          speed: 0.02,
          angle: Math.PI,
          tilt: 0.06
        },
        {
          name: 'Jupiter',
          orbitRadius: 280,
          radius: 12,
          color: '#D8CA9D',
          speed: 0.015,
          angle: Math.PI * 1.5,
          tilt: 0.03,
          hasRings: true,
          moons: [
            { radius: 1.5, distance: 20, color: '#FFFF99', speed: 0.08 },
            { radius: 1.8, distance: 25, color: '#FFE4B5', speed: 0.06 }
          ]
        },
        {
          name: 'Saturn',
          orbitRadius: 360,
          radius: 10,
          color: '#FAD5A5',
          speed: 0.01,
          angle: 0.5,
          tilt: 0.02,
          hasRings: true,
          ringSize: 18,
          moons: [{ radius: 2, distance: 22, color: '#F0E68C', speed: 0.05 }]
        }
      ]
    };

    let time = 0;

    const drawSphere = (ctx, x, y, radius, color, scale, glowColor = null) => {
      if (scale <= 0) return;
      
      const adjustedRadius = radius * scale;
      
      // Draw glow effect
      if (glowColor) {
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, adjustedRadius * 2);
        glowGradient.addColorStop(0, glowColor + '40');
        glowGradient.addColorStop(0.5, glowColor + '20');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, adjustedRadius * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw main sphere with 3D shading
      const gradient = ctx.createRadialGradient(
        x - adjustedRadius * 0.3, y - adjustedRadius * 0.3, 0,
        x, y, adjustedRadius
      );
      gradient.addColorStop(0, color + 'FF');
      gradient.addColorStop(0.7, color + 'CC');
      gradient.addColorStop(1, color + '66');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, adjustedRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add highlight
      const highlight = ctx.createRadialGradient(
        x - adjustedRadius * 0.4, y - adjustedRadius * 0.4, 0,
        x - adjustedRadius * 0.4, y - adjustedRadius * 0.4, adjustedRadius * 0.6
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      highlight.addColorStop(1, 'transparent');
      
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(x, y, adjustedRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawOrbit = (ctx, radius, camera) => {
      ctx.strokeStyle = 'rgba(100, 181, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const projected = project3D(x, 0, z, camera);
        points.push(projected);
      }
      
      points.sort((a, b) => b.z - a.z);
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    };

    const drawRings = (ctx, x, y, innerRadius, outerRadius, scale, color) => {
      if (scale <= 0) return;
      
      const adjustedInner = innerRadius * scale;
      const adjustedOuter = outerRadius * scale;
      
      const gradient = ctx.createRadialGradient(x, y, adjustedInner, x, y, adjustedOuter);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.3, color + '60');
      gradient.addColorStop(0.7, color + '40');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, adjustedOuter, 0, Math.PI * 2);
      ctx.arc(x, y, adjustedInner, 0, Math.PI * 2, true);
      ctx.fill();
    };

    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      const camera = {
        x: cameraAngle.x,
        y: cameraAngle.y + time * 0.1
      };

      // Collect all objects for z-sorting
      const renderObjects = [];

      // Add star
      const starPos = project3D(0, 0, 0, camera);
      renderObjects.push({
        type: 'star',
        ...starPos,
        ...solarSystem.star
      });

      // Add planets and their components
      solarSystem.planets.forEach((planet, planetIndex) => {
        // Update planet position
        planet.angle += planet.speed;
        
        const planetX = Math.cos(planet.angle) * planet.orbitRadius;
        const planetZ = Math.sin(planet.angle) * planet.orbitRadius;
        const planetY = Math.sin(planet.angle * 2) * planet.tilt * 10;
        
        const planetPos = project3D(planetX, planetY, planetZ, camera);
        
        // Add orbit
        renderObjects.push({
          type: 'orbit',
          radius: planet.orbitRadius,
          camera: camera,
          z: 0
        });
        
        // Add rings if planet has them
        if (planet.hasRings) {
          renderObjects.push({
            type: 'rings',
            x: planetPos.x,
            y: planetPos.y,
            innerRadius: planet.radius + 2,
            outerRadius: planet.ringSize || (planet.radius + 8),
            scale: planetPos.scale,
            color: planet.color,
            z: planetPos.z
          });
        }
        
        // Add planet
        renderObjects.push({
          type: 'planet',
          ...planetPos,
          radius: planet.radius,
          color: planet.color,
          name: planet.name
        });
        
        // Add moons
        if (planet.moons) {
          planet.moons.forEach((moon, moonIndex) => {
            const moonAngle = time * moon.speed + moonIndex * Math.PI;
            const moonX = planetX + Math.cos(moonAngle) * moon.distance;
            const moonZ = planetZ + Math.sin(moonAngle) * moon.distance;
            const moonY = planetY + Math.sin(moonAngle) * 2;
            
            const moonPos = project3D(moonX, moonY, moonZ, camera);
            
            renderObjects.push({
              type: 'moon',
              ...moonPos,
              radius: moon.radius,
              color: moon.color
            });
          });
        }
      });

      // Sort by z-depth (back to front)
      renderObjects.sort((a, b) => a.z - b.z);

      // Render all objects
      renderObjects.forEach(obj => {
        switch (obj.type) {
          case 'orbit':
            drawOrbit(ctx, obj.radius, obj.camera);
            break;
          case 'star':
            drawSphere(ctx, obj.x, obj.y, obj.radius, obj.color, obj.scale, obj.glowColor);
            break;
          case 'planet':
            drawSphere(ctx, obj.x, obj.y, obj.radius, obj.color, obj.scale);
            break;
          case 'moon':
            drawSphere(ctx, obj.x, obj.y, obj.radius, obj.color, obj.scale);
            break;
          case 'rings':
            drawRings(ctx, obj.x, obj.y, obj.innerRadius, obj.outerRadius, obj.scale, obj.color);
            break;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction handlers
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setCameraAngle(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, cameraAngle, isDragging, lastMouse]);

  return (
    <div className={`advanced-3d-solar-system ${className}`} style={style}>
      <canvas 
        ref={canvasRef} 
        className="advanced-3d-canvas"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      <div className="advanced-3d-controls">
        <button 
          className="control-button"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button 
          className="control-button"
          onClick={() => setCameraAngle({ x: 0, y: 0 })}
        >
          🔄 Reset View
        </button>
      </div>
      
      <div className="advanced-3d-info">
        <p>🖱️ Drag to rotate • ⏸️ Pause/Play</p>
      </div>
    </div>
  );
};

export default Advanced3DSolarSystem;