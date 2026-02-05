
import React, { useState } from 'react';
import { LEADERSHIP_ACTIVITIES } from '../constants';

export const Leadership: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    setHoveredCard(id);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const getCardStyle = (id: number) => {
    if (hoveredCard !== id) return {};
    
    const card = document.getElementById(`card-${id}`);
    if (!card) return {};
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mousePosition.y - centerY) / 10;
    const rotateY = (centerX - mousePosition.x) / 10;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    };
  };

  return (
    <section id="leadership" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115]">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Leadership & Extracurricular Activities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
        {LEADERSHIP_ACTIVITIES.map((item) => (
          <div 
            key={item.id}
            id={`card-${item.id}`}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            onMouseLeave={handleMouseLeave}
            style={getCardStyle(item.id)}
            className="group relative bg-[#161b22] p-8 rounded-2xl border border-gray-800 hover:border-[#ffbd1255] transition-all duration-300 overflow-hidden"
          >
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffbd120a] rounded-bl-full transform translate-x-4 -translate-y-4" />
            
            {/* 3D Shine Effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: hoveredCard === item.id 
                  ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 189, 18, 0.15), transparent 50%)`
                  : 'none'
              }}
            />
            
            <h3 className="text-[#ffbd12] text-xl font-bold mb-1 relative z-10">{item.role}, {item.title}</h3>
            <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
              {item.description}
            </p>
            
            <div className="mt-auto relative z-10">
              <p className="text-[10px] font-bold text-[#ffbd12] tracking-widest uppercase mb-2">Key Result</p>
              <p className="text-gray-300 italic font-medium leading-relaxed">
                "{item.keyResult}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
