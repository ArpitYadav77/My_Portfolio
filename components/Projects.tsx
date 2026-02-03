
import React from 'react';
import { PROJECTS } from '../constants';

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="min-h-screen px-8 md:px-24 py-24 bg-[#0f1115]">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Selected Work</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div key={project.id} className="group bg-[#161b22] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-white text-2xl font-bold mb-4">{project.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {project.description}
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-[#0a0c10] text-[#ffbd12] text-[10px] font-bold px-3 py-1 rounded tracking-widest border border-[#ffbd1233]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
