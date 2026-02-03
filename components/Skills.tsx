
import React from 'react';
import { SKILL_CARDS } from '../Portfolio/constants';

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115]">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Skills & Mastery</h2>
      
      <div className="max-w-4xl">
        <h3 className="text-[#ffbd12] text-2xl font-bold mb-6">Algorithm Expertise</h3>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          As an SDE, I thrive in environments that challenge my problem-solving abilities. 
          I have solved <span className="text-white font-bold">250+ problems</span> across various competitive platforms.
        </p>

        <div className="flex flex-wrap gap-6 mb-12">
          {SKILL_CARDS.map((card, idx) => (
            <div key={idx} className="bg-[#161b22] px-10 py-8 rounded-2xl border border-gray-800 min-w-[240px]">
              <h4 className="text-white text-xl font-bold mb-1">{card.title}</h4>
              {card.subtitle && (
                <p className="text-[#ffbd12] font-mono text-xs">{card.subtitle}</p>
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
