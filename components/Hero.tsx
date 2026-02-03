
import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

export const Hero: React.FC = () => {
  const skills = ['Java', 'DSA', 'React', 'SQL', 'TypeScript', 'Spring Boot'];
  
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-20 animate-fade-in">
      <div className="max-w-4xl">
        <p className="text-[#ffbd12] font-mono mb-4 text-sm md:text-base">Hi, I am</p>
        <h1 className="text-5xl md:text-8xl font-bold text-white mb-2">
          Arpit Yadav<span className="text-[#ffbd12]">.</span>
        </h1>
        <h2 className="text-3xl md:text-6xl font-bold text-gray-500 mb-8 leading-tight">
          Aspiring Software Development Engineer
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          I build high-performance, scalable systems and intuitive user interfaces. 
          Focused on solving complex algorithmic challenges and delivering exceptional 
          software experiences that make a difference.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-16">
          {skills.map(skill => (
            <span key={skill} className="text-gray-500 font-medium hover:text-gray-300 transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <button className="bg-[#ffbd12] text-[#0f1115] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5a910] transition-colors shadow-lg shadow-[#ffbd1222]">
            Download Resume
          </button>
          <div className="flex gap-6">
            {SOCIAL_LINKS.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
