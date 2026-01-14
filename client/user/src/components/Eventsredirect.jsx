import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Hammer, Music, LayoutGrid, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: LayoutGrid, color: 'text-slate-500', glow: 'bg-slate-500' },
  { id: 'hackathon', label: 'Hackathon', icon: Code, color: 'text-blue-500', glow: 'bg-blue-500' },
  { id: 'workshop', label: 'Workshop', icon: Hammer, color: 'text-orange-500', glow: 'bg-orange-500' },
  { id: 'cultural', label: 'Cultural', icon: Music, color: 'text-pink-500', glow: 'bg-pink-500' },
  { id: 'other', label: 'More', icon: Sparkles, color: 'text-purple-500', glow: 'bg-purple-500' },
];

const EventCategorySwitcher = ({ onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Label */}
      <div className="mb-4 px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Browse Categories
        </h2>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                if (onCategoryChange) onCategoryChange(cat.id);
              }}
              className="relative flex-shrink-0 group outline-none"
            >
              <div className={`
                relative flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500
                ${isActive 
                  ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-200' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }
              `}>
                {/* Icon */}
                <Icon 
                  size={18} 
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : cat.color}`} 
                />

                {/* Text */}
                <span className={`text-xs font-bold transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {cat.label}
                </span>

                {/* Subtle Glow behind Active Icon */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className={`absolute inset-0 opacity-20 blur-xl -z-10 rounded-full ${cat.glow}`}
                  />
                )}
              </div>

              {/* Bottom Dot Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventCategorySwitcher;