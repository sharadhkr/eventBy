import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import userAPI from '../lib/api';
import { Award } from 'lucide-react';

const TopOrganisations = () => {
  const [organisers, setOrganisers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopOrgs = async () => {
      try {
        const res = await userAPI.get('/auth/organisers');
        setOrganisers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching top orgs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopOrgs();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 px-4 py-8 overflow-hidden">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-20 h-28 animate-pulse bg-slate-100 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="px-6 mb-4 flex justify-between items-center">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
          Featured Organisers
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 px-6 overflow-x-auto no-scrollbar scroll-smooth">
        {organisers.map((org, index) => (
          <motion.div
            key={org._id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
          >
            {/* Circular Photo with Gradient Border */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-full -m-[3px] bg-gradient-to-tr ${
                index === 0 ? 'from-yellow-400 to-orange-500' : 'from-slate-200 to-slate-300'
              } p-[2px] transition-transform duration-300 group-hover:rotate-180 group-active:scale-95`} 
              />
              
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white overflow-hidden bg-white">
                <img 
                  src={org.logo || "/default-org.png"} 
                  alt={org.organisationName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>

              {/* Award Badge for Top 1 */}
              {index === 0 && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full shadow-lg border-2 border-white">
                  <Award size={12} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Name at Bottom */}
            <div className="text-center max-w-[80px] sm:max-w-[100px]">
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-700 truncate group-hover:text-slate-900">
                {org.organisationName || org.name}
              </h3>
              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">
                {org.followerCount || 0} Following
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopOrganisations;