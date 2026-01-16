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
import { Home, User } from "lucide-react";
// ✅ Correct this line at the top of NavBar.jsx
import React, { useState, useEffect } from "react"; 
// ... (rest of your framer-motion imports)

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
  const [showHint, setShowHint] = useState(!localStorage.getItem("glass_nav_used"));

  const x = useMotionValue(0);
  const velocity = useVelocity(x);

  const liquidX = useSpring(x, {
    stiffness: 80,
    damping: 30,
    mass: 1.5,
  });

  /* ================= DYNAMIC GLASS THEME ================= */
  // Entire box color shifts based on the ball's spring position
  const glassTint = useTransform(
    liquidX,
    [-MAX_DRAG, 0, MAX_DRAG],
    ["rgba(139, 92, 246, 0.15)", "rgba(255, 255, 255, 0.1)", "rgba(234, 179, 8, 0.15)"]
  );

  const glassBlur = useTransform(
    liquidX,
    [-MAX_DRAG, 0, MAX_DRAG],
    ["blur(40px)", "blur(24px)", "blur(40px)"]
  );

  const isLeft = location.pathname === "/profile";
  const isRight = location.pathname === "/home";

  useEffect(() => {
    x.set(0);
  }, [location.pathname]);

  /* ================= ANIMATION TRANSFORMS ================= */
  const ballScale = useTransform(x, [-MAX_DRAG, 0, MAX_DRAG], [1.1, 1, 1.1]);
  
  // Labels shift slightly towards the ball to look "magnetic"
  const leftLabelX = useTransform(liquidX, [-MAX_DRAG, 0], [0, 10]);
  const rightLabelX = useTransform(liquidX, [0, MAX_DRAG], [-10, 0]);

  // Persistent Route Washing (Enhanced)
  const routeWashColor = isLeft ? "rgba(139, 92, 246, 0.08)" : isRight ? "rgba(234, 179, 8, 0.08)" : "transparent";

  /* ================= DRAG HANDLERS ================= */
  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.x < -THRESHOLD) {
      navigate("/profile");
    } else if (info.offset.x > THRESHOLD) {
      navigate("/home");
    }
    x.set(0);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] perspective-[1000px]">
      <motion.div 
        style={{ 
          backgroundColor: glassTint,
          backdropFilter: glassBlur,
        }}
        className="relative w-[360px] h-16 rounded-full border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center overflow-hidden"
      >
        {/* ================= STATIC ROUTE COLOR LAYER ================= */}
        <motion.div 
            animate={{ backgroundColor: routeWashColor }}
            className="absolute inset-0 transition-colors duration-700 pointer-events-none"
        />

        {/* ================= LIQUID FILL INDICATORS ================= */}
        <motion.div
          style={{
            opacity: useTransform(liquidX, [-MAX_DRAG, -20, 0], [0.6, 0.2, 0]),
            background: "linear-gradient(to right, rgba(139,92,246,0.3), transparent)",
          }}
          className="absolute inset-0 pointer-events-none"
        />
        <motion.div
          style={{
            opacity: useTransform(liquidX, [0, 20, MAX_DRAG], [0, 0.2, 0.6]),
            background: "linear-gradient(to left, rgba(234,179,8,0.3), transparent)",
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* ================= NAV CONTENT ================= */}
        <div className="relative z-20 w-full flex items-center justify-between px-10">
          
          {/* PROFILE SECTION */}
          <motion.div 
            style={{ x: leftLabelX }}
            className={`flex items-center gap-2 transition-colors duration-300 ${isLeft ? 'text-violet-600' : 'text-gray-500'}`}
          >
            <User size={20} strokeWidth={isLeft ? 2.5 : 2} />
            <motion.span 
                style={{ opacity: useTransform(liquidX, [-MAX_DRAG, -THRESHOLD, 0], [1, 0.4, isLeft ? 1 : 0]) }}
                className="text-xs font-bold tracking-tight"
            >
              Profile
            </motion.span>
          </motion.div>

          {/* ================= INTERACTIVE BALL ================= */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={() => { setIsDragging(true); setShowHint(false); localStorage.setItem("glass_nav_used", "true"); }}
              onDragEnd={handleDragEnd}
              style={{ x, scale: ballScale }}
              className="w-14 h-14 rounded-full bg-white shadow-[0_8px_25px_rgba(0,0,0,0.2)] cursor-grab active:cursor-grabbing flex items-center justify-center group"
            >
              {/* Ball Shine */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-white/10" />
              
              {/* Velocity-based ripple inside ball */}
              <motion.div 
                style={{ scale: useTransform(velocity, [-2000, 2000], [1.2, 1.2]) }}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
              >
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-active:scale-150 transition-transform" />
              </motion.div>

              {showHint && (
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                  Swipe
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* HOME SECTION */}
          <motion.div 
            style={{ x: rightLabelX }}
            className={`flex items-center gap-2 transition-colors duration-300 ${isRight ? 'text-yellow-600' : 'text-gray-500'}`}
          >
             <motion.span 
                style={{ opacity: useTransform(liquidX, [0, THRESHOLD, MAX_DRAG], [isRight ? 1 : 0, 0.4, 1]) }}
                className="text-xs font-bold tracking-tight"
            >
              Home
            </motion.span>
            <Home size={20} strokeWidth={isRight ? 2.5 : 2} />
          </motion.div>
        </div>

        {/* Velocity Inertia Layer (Amazing smooth glow) */}
        <motion.div 
           style={{ 
             opacity: useTransform(velocity, [-2000, 0, 2000], [0.4, 0, 0.4]),
             backgroundColor: useTransform(velocity, [-1, 0, 1], ["#8b5cf6", "transparent", "#eab308"])
           }}
           className="absolute inset-0 pointer-events-none blur-xl"
        />
      </motion.div>
    </div>
  );
};

export default GlassLiquidNavBar;
