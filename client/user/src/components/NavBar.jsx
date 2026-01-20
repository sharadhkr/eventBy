import React, { useState, useEffect } from "react";
import { Map, Calendar, LayoutGrid, User, Home, Sparkles } from "lucide-react";
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
const THRESHOLD = 70;

const GlassLiquidNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);

  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const liquidX = useSpring(x, { stiffness: 150, damping: 28, mass: 1 });

  // Define all transforms at the top level
  const leftGlowOpacity = useTransform(liquidX, [-MAX_DRAG, -30, 0], [1, 0.4, 0]);
  const leftGlowScale = useTransform(liquidX, [-MAX_DRAG, 0], [1.5, 1]);
  const rightGlowOpacity = useTransform(liquidX, [0, 30, MAX_DRAG], [0, 0.4, 1]);
  const rightGlowScale = useTransform(liquidX, [0, MAX_DRAG], [1, 1.5]);
  const velocityOpacity = useTransform(velocity, [-3000, 0, 3000], [0.5, 0, 0.5]);

  /* ================= DYNAMIC ROUTE THEMES ================= */
  const themes = {
    "/": { 
      color: "rgba(255, 255, 255, 0.12)", 
      glow: "#a78bfa", 
      icon: "text-violet-500",
      shadow: "0 20px 40px -12px rgba(167, 139, 250, 0.3)"
    },
    "/events": { 
      color: "rgba(236, 72, 153, 0.15)", 
      glow: "#ec4899", 
      icon: "text-pink-500",
      shadow: "0 20px 40px -12px rgba(236, 72, 153, 0.35)"
    },
    "/map": { 
      color: "rgba(245, 158, 11, 0.12)", 
      glow: "#f59e0b", 
      icon: "text-amber-500",
      shadow: "0 20px 40px -12px rgba(245, 158, 11, 0.35)"
    },
    "/profile": { 
      color: "rgba(168, 85, 247, 0.15)", 
      glow: "#a855f7", 
      icon: "text-purple-500",
      shadow: "0 20px 40px -12px rgba(168, 85, 247, 0.35)"
    }
  };

  const currentTheme = themes[location.pathname] || themes["/"];
  const isHome = location.pathname === "/";

  useEffect(() => { 
    x.set(0); 
    setDragDirection(null);
  }, [location.pathname, x]);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocityX = info.velocity.x;
    
    // SWAPPED: right goes to map, left goes to events
    if (offset > THRESHOLD || velocityX > 500) {
      setDragDirection("right");
      setTimeout(() => navigate("/map"), 100);
    } else if (offset < -THRESHOLD || velocityX < -500) {
      setDragDirection("left");
      setTimeout(() => navigate("/events"), 100);
    } else {
      x.set(0);
      setDragDirection(null);
    }
  };

  const handleCenterClick = () => {
    if (!isDragging) {
      navigate("/");
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-4 w-full max-w-md">
      <motion.div 
        animate={{ 
          backgroundColor: currentTheme.color,
          boxShadow: [
            currentTheme.shadow,
            `0 25px 50px -15px ${currentTheme.glow}45`,
            currentTheme.shadow
          ],
        }}
        transition={{ 
          backgroundColor: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-full max-w-[360px] mx-auto h-[72px] rounded-[28px] backdrop-blur-2xl flex items-center overflow-hidden border border-white/30"
        style={{
          boxShadow: currentTheme.shadow,
        }}
      >
        {/* ================= ANIMATED BACKGROUND EFFECTS ================= */}
        
        {/* Soft shimmer overlay */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.glow}10, transparent, ${currentTheme.glow}15)`,
            backgroundSize: "200% 200%"
          }}
        />

        {/* Home gradient animation */}
        <AnimatePresence>
          {isHome && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.15,
                background: [
                  "linear-gradient(60deg, #a78bfa, #ec4899, #f59e0b)",
                  "linear-gradient(60deg, #f59e0b, #ec4899, #a78bfa)",
                  "linear-gradient(60deg, #a78bfa, #ec4899, #f59e0b)",
                ]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.5 },
                background: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-0 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Floating particles */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-4 left-8 w-1 h-1 rounded-full bg-white/40 blur-[1px]" />
          <div className="absolute bottom-5 right-12 w-1.5 h-1.5 rounded-full bg-white/30 blur-[1px]" />
          <div className="absolute top-6 right-20 w-1 h-1 rounded-full bg-white/50 blur-[1px]" />
        </motion.div>

        {/* ================= LIQUID DRAG GLOWS (SWAPPED COLORS) ================= */}
        {/* Left glow - PINK for Events */}
        <motion.div
          style={{
            opacity: leftGlowOpacity,
            scaleX: leftGlowScale,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/35 via-pink-300/15 to-transparent blur-xl" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-pink-400/25 rounded-full blur-3xl" />
        </motion.div>

        {/* Right glow - AMBER for Map */}
        <motion.div
          style={{
            opacity: rightGlowOpacity,
            scaleX: rightGlowScale,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-amber-400/35 via-amber-300/15 to-transparent blur-xl" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-amber-400/25 rounded-full blur-3xl" />
        </motion.div>

        {/* Velocity glow */}
        <motion.div 
          style={{ 
            opacity: velocityOpacity,
            backgroundColor: currentTheme.glow
          }}
          className="absolute inset-0 pointer-events-none blur-2xl"
        />

        <div className="relative z-20 w-full flex items-center justify-between px-10 sm:px-12">
          
          {/* LEFT: EVENTS (Pink) */}
          <motion.button
            onClick={() => navigate("/events")}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            animate={{ 
              scale: location.pathname === "/events" ? 1.15 : 1,
              y: location.pathname === "/events" ? -4 : 0
            }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className={`flex flex-col items-center gap-1 transition-all duration-500 relative ${
              location.pathname === "/events" ? 'text-pink-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {location.pathname === "/events" && (
              <>
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-pink-400/20 blur-md"
                />
              </>
            )}
            <Calendar size={20} strokeWidth={2.5} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Events</span>
          </motion.button>

          {/* ================= CENTER INTERACTIVE HUB ================= */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.7, right: 0.7 }}
              dragMomentum={true}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              onClick={handleCenterClick}
              style={{ x }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                rotate: isDragging ? [0, -3, 3, 0] : 0,
              }}
              transition={{
                rotate: { duration: 0.25, repeat: isDragging ? Infinity : 0 }
              }}
              className="relative cursor-grab active:cursor-grabbing"
            >
              {/* Outer animated glow */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.25, 0.45, 0.25]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-full blur-lg"
                style={{ backgroundColor: currentTheme.glow }}
              />

              {/* Main button */}
              <div className="relative w-14 h-14 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center">
                
                {/* Spinning ring */}
                <motion.div 
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  }}
                  className="absolute inset-1 rounded-full border-[2px] border-dashed opacity-20"
                  style={{ borderColor: currentTheme.glow }}
                />

                {/* Inner sparkle */}
                <motion.div
                  animate={{
                    scale: [0.8, 1, 0.8],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-3 rounded-full"
                  style={{ backgroundColor: `${currentTheme.glow}20` }}
                />

                {/* Icon */}
                <motion.div
                  animate={{ rotate: isHome ? 0 : 180 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {isHome ? (
                    <Sparkles size={22} className={`${currentTheme.icon} transition-colors duration-500`} />
                  ) : (
                    <LayoutGrid size={22} className={`${currentTheme.icon} transition-colors duration-500`} />
                  )}
                </motion.div>

                {/* Drag hint indicators */}
                <AnimatePresence>
                  {!isDragging && isHome && (
                    <>
                      {/* Left hint - Pink */}
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: [0, 0.7, 0], x: [-12, -22, -32] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-pink-400"
                      />
                      {/* Right hint - Amber */}
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: [0, 0.7, 0], x: [12, 22, 32] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, delay: 0.3 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: MAP (Amber) */}
          <motion.button
            onClick={() => navigate("/map")}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            animate={{ 
              scale: location.pathname === "/map" ? 1.15 : 1,
              y: location.pathname === "/map" ? -4 : 0
            }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className={`flex flex-col items-center gap-1 transition-all duration-500 relative ${
              location.pathname === "/map" ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {location.pathname === "/map" && (
              <>
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-amber-400/20 blur-md"
                />
              </>
            )}
            <Map size={20} strokeWidth={2.5} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Explore</span>
          </motion.button>
        </div>

        {/* Drag direction feedback */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold text-gray-700 shadow-lg border border-white/40"
              >
                {x.get() < -20 ? (
                  <span className="text-pink-600">← Events</span>
                ) : x.get() > 20 ? (
                  <span className="text-amber-600">Explore →</span>
                ) : (
                  <span>Swipe</span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Soft bottom shadow */}
      <motion.div 
        animate={{
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-full blur-xl -z-10"
        style={{ backgroundColor: currentTheme.glow }}
      />
    </div>
  );
};

export default GlassLiquidNavBar;