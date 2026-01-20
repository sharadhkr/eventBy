import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/auth.context';
import api from '../lib/api';
import { Sparkles } from 'lucide-react';

const TopOrganisations = () => {
  const { user } = useAuth();
  const [organisers, setOrganisers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopOrgs = useCallback(async () => {
    try {
      const res = await api.get('/users/organisers');
      setOrganisers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching orgs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopOrgs();
  }, [fetchTopOrgs, user]);

  if (loading) {
    return (
      <div className="flex gap-6 px-6 py-8 overflow-hidden">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-16 h-16 animate-pulse bg-slate-100 rounded-2xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full pt-4 relative">
      <div className="px-6 mb-2 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-violet-400" />
          <h2 className="text-[15px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Elite Creators
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-6 px-6 overflow-x-auto no-scrollbar scroll-smooth">
        {organisers.map((org, index) => (
          <motion.div
            key={org._id || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ rotate: index % 2 === 0 ? 3 : -3 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-shrink-0 relative group pt-2 pb-6"
          >
            {/* The Compact Organic Shape (Returning to ~16-20 size) */}
            <div className="relative w-16 h-16 sm:w-20 drop-shadow-xl sm:h-20">
              {/* Animated Background Border */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 opacity-20 group-hover:opacity-100 transition-all duration-500 blur-[2px]"
                style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
              />
              
              {/* Image Container */}
              <div 
                className="absolute inset-[2px] bg-white border border-white overflow-hidden shadow-sm transition-all duration-500"
                style={{ borderRadius: '63% 37% 30% 70% / 50% 45% 55% 50%' }}
              >
                <img 
                  src={org.logo || `https://api.dicebear.com{org.organisationName}`} 
                  alt={org.organisationName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Glassmorphic Minimal Badge */}
              <div className="absolute -bottom-1 -right-2 bg-white/80 backdrop-blur-md border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">
                <p className="text-[9px] font-bold text-slate-700 whitespace-nowrap tracking-tight">
                  {org.organisationName?.split(' ')[0] || "Org"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TopOrganisations;
