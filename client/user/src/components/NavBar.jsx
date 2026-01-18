import React, { useState, useEffect } from "react";
import { Map, Calendar, LayoutGrid, User, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  AnimatePresence,
} from "framer-motion";

const MAX_DRAG = 140;
const THRESHOLD = 85;

const GlassLiquidNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const liquidX = useSpring(x, { stiffness: 80, damping: 30, mass: 1.5 });

  /* ================= DYNAMIC ROUTE THEMES ================= */
  const themes = {
    "/events": { color: "rgba(99, 102, 241, 0.25)", glow: "#6366f1", icon: "text-indigo-600" },
    "/map": { color: "rgba(16, 185, 129, 0.25)", glow: "#10b981", icon: "text-emerald-600" },
    "default": { color: "rgba(255, 255, 255, 0.1)", glow: "#ffffff", icon: "text-slate-400" }
  };

  const currentTheme = themes[location.pathname] || themes["default"];
  const isNeutral = !themes[location.pathname];

  useEffect(() => { x.set(0); }, [location.pathname]);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.x < -THRESHOLD) navigate("/map");
    else if (info.offset.x > THRESHOLD) navigate("/events");
    x.set(0);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] perspective-[1000px]">
      <motion.div 
        /* 🔥 Animated Glass Background */
        animate={{ 
          backgroundColor: currentTheme.color,
          boxShadow: `0 20px 50px -12px ${currentTheme.glow}33`,
          border: `1px solid ${currentTheme.glow}66`
        }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative w-[360px] drop-shadow-2xl h-18 rounded-4xl backdrop-blur-xl flex items-center overflow-hidden"
      >
        {/* ================= NEUTRAL RAINBOW GRADIENT (For /home, /profile) ================= */}
        <AnimatePresence>
          {isNeutral && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.15,
                background: [
                  "linear-gradient(45deg, #ff0080, #7928ca)",
                  "linear-gradient(45deg, #0070f3, #00dfd8)",
                  "linear-gradient(45deg, #f59e0b, #ef4444)",
                  "linear-gradient(45deg, #ff0080, #7928ca)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* ================= LIQUID DRAG GLOWS ================= */}
        <motion.div
          style={{
            opacity: useTransform(liquidX, [-MAX_DRAG, -20, 0], [0.8, 0.3, 0]),
            background: "linear-gradient(to right, #10b981, transparent)",
          }}
          className="absolute inset-0 pointer-events-none blur-md"
        />
        <motion.div
          style={{
            opacity: useTransform(liquidX, [0, 20, MAX_DRAG], [0, 0.3, 0.8]),
            background: "linear-gradient(to left, #6366f1, transparent)",
          }}
          className="absolute inset-0 pointer-events-none blur-md"
        />

        <div className="relative z-20 w-full flex items-center justify-between px-10">
          
          {/* LEFT: EVENTS */}
          <motion.div 
            animate={{ scale: location.pathname === "/events" ? 1.1 : 1 }}
            className={`flex flex-col items-center gap-1 transition-colors duration-500 ${location.pathname === "/events" ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Calendar size={20} strokeWidth={2.5} />
            <span className="text-[8px] font-black uppercase tracking-widest">Events</span>
          </motion.div>

          {/* ================= CENTER INTERACTIVE HUB ================= */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              onClick={() => !isDragging && navigate("/")}
              style={{ x }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-15 h-15 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing flex items-center justify-center relative"
            >
              {/* Inner animated ring */}
              <motion.div 
                animate={{ 
                  rotate: 360,
                  borderColor: [currentTheme.glow, "#ffffff", currentTheme.glow] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full border-2 border-dashed opacity-30" 
              />
              
              <LayoutGrid size={22} className={`${currentTheme.icon} transition-colors duration-500`} />
            </motion.div>
          </div>

          {/* RIGHT: MAP */}
          <motion.div 
            animate={{ scale: location.pathname === "/map" ? 1.1 : 1 }}
            className={`flex flex-col items-center gap-1 transition-colors duration-500 ${location.pathname === "/map" ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Map size={20} strokeWidth={2.5} />
            <span className="text-[8px] font-black uppercase tracking-widest">Explore</span>
          </motion.div>
        </div>

        {/* Dynamic Velocity "Friction" Glow */}
        <motion.div 
           style={{ 
             opacity: useTransform(velocity, [-2000, 0, 2000], [0.6, 0, 0.6]),
             backgroundColor: currentTheme.glow
           }}
           className="absolute inset-0 pointer-events-none blur-3xl"
        />
      </motion.div>
    </div>
  );
};

export default GlassLiquidNavBar;
