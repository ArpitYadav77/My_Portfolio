
import React, { useState } from 'react';
import { SKILL_CARDS } from "../constants";


export const Skills: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    setHoveredCard(idx);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const getCardStyle = (idx: number) => {
    if (hoveredCard !== idx) return {};
    
    const card = document.getElementById(`skill-card-${idx}`);
    if (!card) return {};
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mousePosition.y - centerY) / 10;
    const rotateY = (centerX - mousePosition.x) / 10;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out'
    };
  };

  return (
    <section id="skills" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115]">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Skills & Mastery</h2>
      
      <div className="max-w-4xl">
        <h3 className="text-[#ffbd12] text-2xl font-bold mb-6">Algorithm Expertise</h3>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          As an SDE, I thrive in environments that challenge my problem-solving abilities. 
          I have solved <span className="text-white font-bold">250+ problems</span> across various competitive platforms.
        </p>

        <div className="flex flex-wrap gap-6 mb-12" style={{ perspective: '1000px' }}>
          {SKILL_CARDS.map((card, idx) => (
            <div 
              key={idx} 
              id={`skill-card-${idx}`}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              style={getCardStyle(idx)}
              className="group relative bg-[#161b22] px-10 py-8 rounded-2xl border border-gray-800 hover:border-[#ffbd1255] min-w-[240px] transition-all duration-300 overflow-hidden"
            >
              {/* 3D Shine Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{
                  background: hoveredCard === idx 
                    ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 189, 18, 0.2), transparent 50%)`
                    : 'none'
                }}
              />
              
              <h4 className="text-white text-xl font-bold mb-1 relative z-10">{card.title}</h4>
              {card.subtitle && (
                <p className="text-[#ffbd12] font-mono text-xs relative z-10">{card.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl border-l-2 border-[#ffbd1233] pl-6">
          Expert in Data Structures (Trees, Graphs, Linked Lists) and Design Paradigms 
          (Dynamic Programming, Greedy, Backtracking).
        </p>
      </div>
    </section>
  );
};
