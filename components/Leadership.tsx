
import React from 'react';
import { LEADERSHIP_ACTIVITIES } from '../constants';

export const Leadership: React.FC = () => {
  return (
    <section id="leadership" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115]">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Leadership & Extracurricular Activities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LEADERSHIP_ACTIVITIES.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-[#161b22] p-8 rounded-2xl border border-gray-800 hover:border-[#ffbd1255] transition-all duration-300 overflow-hidden"
          >
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffbd120a] rounded-bl-full transform translate-x-4 -translate-y-4" />
            
            <h3 className="text-[#ffbd12] text-xl font-bold mb-1">{item.role}, {item.title}</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              {item.description}
            </p>
            
            <div className="mt-auto">
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
