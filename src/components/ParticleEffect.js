import React, { useState, useEffect } from 'react';
import './ParticleEffect.css';

const ParticleEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 200; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 5 + 3,
          speedX: Math.random() * 3 - 2,
          speedY: Math.random() * 3 - 2,
        });
      }
      setParticles(newParticles);
    };

    const updateParticles = (mouseX, mouseY) => {
      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          let speedX = particle.speedX;
          let speedY = particle.speedY;

          // Verificar a proximidade do mouse
          const distance = Math.sqrt(
            (particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2
          );

          if (distance < 50) {
            // Ajustar a velocidade com base na proximidade do mouse
            const acceleration = (50 - distance) / 100;
            speedX += (particle.x - mouseX) * acceleration * 0.02;
            speedY += (particle.y - mouseY) * acceleration * 0.02;
          }

          // Atualizar posição das partículas
          return {
            ...particle,
            x: particle.x + speedX,
            y: particle.y + speedY,
          };
        });
      });
    };

    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      updateParticles(mouseX, mouseY);
    };

    const handleResize = () => {
      generateParticles();
    };

    generateParticles();

    const intervalId = setInterval(() => updateParticles(), 30);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x + 'px',
            top: particle.y + 'px',
            width: particle.size + 'px',
            height: particle.size + 'px',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
