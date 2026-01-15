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

// export default NavBar;
import React, { useEffect } from "react";
import { Home, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const GlassLiquidNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* Ball motion (fast) */
  const x = useMotionValue(0);

  /* Liquid motion (slow & viscous) */
  const liquidX = useSpring(x, {
    stiffness: 70,
    damping: 30,
    mass: 1.8,
  });

  const THRESHOLD = 90;

  /* Fill scale */
  const fillScale = useTransform(liquidX, [-140, 0, 140], [1, 0, 1]);

  /* Labels */
  const leftLabelOpacity = useTransform(liquidX, [-120, -40], [1, 0]);
  const rightLabelOpacity = useTransform(liquidX, [40, 120], [0, 1]);

  /* Keep filled based on route */
  useEffect(() => {
    if (location.pathname === "/profile") {
      x.set(-140);
    } else if (location.pathname === "/home") {
      x.set(140);
    } else {
      x.set(0);
    }
  }, [location.pathname]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -THRESHOLD) {
      x.set(-140);
      setTimeout(() => navigate("/profile"), 350);
    } else if (info.offset.x > THRESHOLD) {
      x.set(140);
      setTimeout(() => navigate("/home"), 350);
    } else {
      x.set(0);
    }
  };

  const isLeft = location.pathname === "/profile";
  const isRight = location.pathname === "/home";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative w-[360px] h-16 rounded-full overflow-hidden">

        {/* 🧊 GLASS TUBE */}
        <div className="absolute inset-0 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 shadow-[inset_0_0_18px_rgba(255,255,255,0.6)]" />

        {/* 🌊 LIQUID BASE */}
        {(isLeft || isRight) && (
          <motion.div
            style={{
              scaleX: fillScale,
              transformOrigin: isLeft ? "left" : "right",
            }}
            className={`absolute inset-0 ${
              isLeft
                ? "bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400"
                : "bg-gradient-to-l from-teal-400 via-cyan-300 to-teal-400"
            }`}
          />
        )}

        {/* ✨ LIQUID HIGHLIGHT (MENISCUS EFFECT) */}
        {(isLeft || isRight) && (
          <motion.div
            style={{
              scaleX: fillScale,
              transformOrigin: isLeft ? "left" : "right",
            }}
            className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none"
          />
        )}

        {/* 🌫 INNER SHADOW DEPTH */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.15)] pointer-events-none" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center justify-between px-8 text-gray-700">

          {/* PROFILE */}
          <div className="flex items-center gap-2">
            <User size={22} />
            <motion.span
              style={{ opacity: leftLabelOpacity }}
              className="text-sm font-medium"
            >
              Profile
            </motion.span>
          </div>

          {/* ⚪ WHITE LIQUID BALL */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.55}
              onDragEnd={handleDragEnd}
              style={{ x }}
              className="w-14 h-14 rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* HOME */}
          <div className="flex items-center gap-2">
            <motion.span
              style={{ opacity: rightLabelOpacity }}
              className="text-sm font-medium"
            >
              Home
            </motion.span>
            <Home size={22} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default GlassLiquidNavBar;
