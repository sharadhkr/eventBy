import { Home, PlusCircle, LayoutGrid, BarChart3, User, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/events/create", icon: PlusCircle, label: "Create" },
  { path: "/events/manage", icon: LayoutGrid, label: "Events" },
  { path: "/analytics", icon: BarChart3, label: "Stats" },
  { path: "/profile/edit", icon: User, label: "Profile" },
];

const BUBBLE_WIDTH = 100;

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.path === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  const updateBubblePosition = () => {
    const activeEl = itemRefs.current[activeIndex];
    const navEl = navRef.current;
    if (!activeEl || !navEl) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setBubbleStyle({
      left: `${itemRect.left - navRect.left + itemRect.width / 2 - BUBBLE_WIDTH / 2}px`,
      width: `${BUBBLE_WIDTH}px`,
      height: `45px`,
    });
  };

  useEffect(() => {
    updateBubblePosition();
    window.addEventListener("resize", updateBubblePosition);
    return () => window.removeEventListener("resize", updateBubblePosition);
  }, [activeIndex]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl px-2">
      <nav
        ref={navRef}
        className="relative bg-white/60 backdrop-blur-2xl rounded-full py-3 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden"
      >
        {/* 🌈 Soft Aura Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-200/40 blur-3xl" />
          <div className="absolute top-0 right-1/3 w-32 h-32 bg-yellow-100/40 blur-3xl" />
        </div>

        {/* 💊 Floating Glass Bubble */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0"
          style={{
            ...bubbleStyle,
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-yellow-500/10 rounded-full border border-white/50 shadow-sm" />
        </div>

        {/* 🔘 Navigation Items */}
        <div className="relative flex items-center justify-around md:justify-center gap-2 md:gap-8 px-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeIndex === index;

            return (
              <button
                key={tab.path}
                ref={el => (itemRefs.current[index] = el)}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-row items-center justify-center gap-2 px-3 py-2 z-10 group"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-all duration-500 ${
                      isActive
                        ? "text-violet-600 scale-110 drop-shadow-md"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-600 rounded-full" />
                  )}
                </div>

                <span
                  className={`text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
                    isActive
                      ? "text-violet-700 opacity-100 max-w-[100px] ml-1"
                      : "opacity-0 max-w-0 pointer-events-none overflow-hidden"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
