
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { SectionId } from '../types';

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 md:w-20 bg-[#0a0c10] border-r border-gray-800 flex flex-col items-center py-8 z-50">
      <div className="flex flex-col gap-8 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative p-3 rounded-xl transition-all duration-300 group ${
              activeSection === item.id 
                ? 'text-[#ffbd12]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title={item.label}
          >
            {activeSection === item.id && (
              <span className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#ffbd12] rounded-r-full" />
            )}
            <div className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            {/* Tooltip for desktop */}
            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div className="text-[10px] text-gray-700 font-mono rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>
        v1.0.4
      </div>
    </aside>
  );
};
