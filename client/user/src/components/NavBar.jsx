// import { Home, Calendar, User } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const tabs = [
//   { path: "/home", icon: Home, label: "Home" },
//   { path: "/events", icon: Calendar, label: "Events" },
//   { path: "/profile", icon: User, label: "Profile" },
// ];

// const BUBBLE_WIDTH = 90;

// const NavBar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [bubbleStyle, setBubbleStyle] = useState({});
//   const navRef = useRef(null);
//   const itemRefs = useRef([]);

//   // 🔁 Sync active tab with route
//   useEffect(() => {
//     const index = tabs.findIndex(tab => tab.path === location.pathname);
//     if (index !== -1) setActiveIndex(index);
//   }, [location.pathname]);

//   // 🎯 Update bubble position
//   const updateBubblePosition = () => {
//     const activeEl = itemRefs.current[activeIndex];
//     const navEl = navRef.current;

//     if (!activeEl || !navEl) return;

//     const navRect = navEl.getBoundingClientRect();
//     const itemRect = activeEl.getBoundingClientRect();

//     setBubbleStyle({
//       left: `${itemRect.left - navRect.left + itemRect.width / 2 - BUBBLE_WIDTH / 2}px`,
//       width: `${BUBBLE_WIDTH}px`,
//       height: `${itemRect.height}px`,
//     });
//   };

//   useEffect(() => {
//     updateBubblePosition();
//     window.addEventListener("resize", updateBubblePosition);
//     return () => window.removeEventListener("resize", updateBubblePosition);
//   }, [activeIndex]);

//   return (
//     <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-3xl px-2">
//       <nav
//         ref={navRef}
//         className="relative bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-2xl rounded-3xl md:rounded-full py-2 shadow-[0_20px_70px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden"
//       >
//         {/* 🌈 Ambient glow */}
//         <div className="absolute inset-0 rounded-3xl md:rounded-full overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
//         </div>

//         {/* 💊 Bubble */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 transition-all duration-500"
//           style={{
//             ...bubbleStyle,
//             transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
//           }}
//         >
//           <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl md:rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
//         </div>

//         {/* 🔘 Tabs */}
//         <div className="relative flex items-center justify-between md:justify-center gap-1 md:gap-2 px-2">
//           {tabs.map((tab, index) => {
//             const Icon = tab.icon;
//             const isActive = activeIndex === index;

//             return (
//               <button
//                 key={tab.path}
//                 ref={el => (itemRefs.current[index] = el)}
//                 onClick={() => {
//                   setActiveIndex(index);
//                   navigate(tab.path);
//                 }}
//                 className="relative flex flex-row items-center justify-center gap-2 flex-1 md:flex-initial md:min-w-[75px] px-3 py-3 z-10 transition-all duration-300"
//               >
//                 {/* ✨ Icon */}
//                 <div className="relative">
//                   {isActive && (
//                     <div className="absolute inset-0 blur-lg bg-white/30 scale-150 rounded-full" />
//                   )}
//                   <Icon
//                     size={isActive ? 24 : 22}
//                     className={`relative transition-all duration-300 ${
//                       isActive
//                         ? "text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
//                         : "text-gray-400"
//                     }`}
//                   />
//                 </div>

//                 {/* 🏷 Label (RIGHT of icon) */}
//                 <span
//                   className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
//                     isActive
//                       ? "text-white opacity-100 translate-x-0"
//                       : "opacity-0 absolute pointer-events-none -translate-x-2"
//                   }`}
//                 >
//                   {tab.label}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         {/* ✨ Bottom shine */}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
//       </nav>
//     </div>
//   );
// };

// export default NavBar;import React, { useEffect, useState } from "react";
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
