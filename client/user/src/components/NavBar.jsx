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

import React, { useState } from "react";
import { Home, User, Fingerprint } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const SpringSliderNavBar = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Scroll visibility logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 50) setHidden(true);
    else setHidden(false);
  });

  const x = useMotionValue(0);

  // Adjusted physics for a satisfying "Snap"
  const springX = useSpring(x, { 
    stiffness: 800, 
    damping: 35, 
    mass: 0.5 
  });

  const barStretch = useTransform(x, [-100, 0, 100], [1.1, 1, 1.1]);
  const leftOpacity = useTransform(x, [-80, -20], [1, 0.4]);
  const rightOpacity = useTransform(x, [20, 80], [0.4, 1]);

  const handleDragEnd = (_, info) => {
    const threshold = 80;
    
    if (info.offset.x > threshold) {
        // navigate("/home");
    } else if (info.offset.x < -threshold) {
        // navigate("/profile");
    }

    // This is the "Automatic Return" logic
    x.set(0);
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[350px] px-4"
        >
          <motion.nav
            style={{ scaleX: barStretch }}
            className="relative h-14 bg-stone-500/20 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl flex items-center justify-between px-10"
          >
            <motion.div style={{ opacity: leftOpacity }}><User size={22} className="text-slate-400" /></motion.div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full h-full pointer-events-none">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} // Constraints at 0 forces it to want to stay at center
                dragElastic={0.9} // High elasticity allows movement but pulls back like a spring
                onDragEnd={handleDragEnd}
                style={{ x: springX }}
                className="pointer-events-auto cursor-grab active:cursor-grabbing w-12 h-12 bg-stone-600 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Fingerprint size={24} className="text-white" />
              </motion.div>
            </div>

            <motion.div style={{ opacity: rightOpacity }}><Home size={22} className="text-slate-900" /></motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpringSliderNavBar;
