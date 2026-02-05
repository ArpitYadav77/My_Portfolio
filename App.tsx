import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { Leadership } from './components/Leadership';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { SectionId } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.Home);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (id: SectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as SectionId);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = Object.values(SectionId);
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CustomCursor />
      <div className="flex bg-[#0f1115] min-h-screen text-gray-200 selection:bg-[#ffbd1233] selection:text-[#ffbd12]">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
        
        <main className="flex-1 ml-16 md:ml-20 overflow-x-hidden">
          <Hero />
          <Leadership />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </>
  );
};

export default App;
