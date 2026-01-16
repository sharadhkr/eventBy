import React from 'react';
import { Link } from 'react-router-dom';
/* ✅ 1. Import the useAuth hook */
import { useAuth } from '../context/auth.context';

function Topbar() {
  /* ✅ 2. Destructure 'user' from Context */
  const { user } = useAuth();

  return (
    <div className="relative w-full">
      <div className="relative flex items-center justify-between px-3 py-3 backdrop-blur-xl z-50 drop-shadow-xl bg-white mt-4 m-2 rounded-3xl">
        
        {/* Left Section: User Profile */}
        <div className="flex items-center gap-3">
             <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <img 
              className="w-10 h-10 rounded-full shadow-md object-cover" 
              /* ✅ 3. Use user photoURL or fallback */
              src={user?.photoURL || "https://img.icons8.com"} 
              alt="Profile" 
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
          </div>
          </Link>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 leading-tight">
              {/* ✅ 4. Use dynamic user display name */}
              Hello, <span className="text-purple-600">{user?.displayName || "Guest"}!</span>
            </h2>
          </div>
        </div>

        {/* Right Section: Action Icons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <img className="w-6 h-6 opacity-70 hover:opacity-100" src="https://img.icons8.com/?size=48&id=UJnkuFxctx6X&format=png" alt="Notifications" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <img className="w-6 h-6 opacity-70 hover:opacity-100" src="https://img.icons8.com/?size=48&id=A7j5iYOMBYSv&format=png" alt="Settings" />
          </button>
        </div>
        
      </div>

      {/* Background Blurs */}
      <div className="absolute w-full z-10 opacity-20 top-0 left-0 flex items-center justify-center blur-2xl pointer-events-none">
        <div className="w-[30%] h-20 bg-purple-400"></div>
        <div className="w-[40%] h-20 skew-x-12 bg-pink-400"></div>
        <div className="w-[30%] h-20 skew-x-12 bg-yellow-400"></div>
      </div>
    </div>
  );
}

export default Topbar;
