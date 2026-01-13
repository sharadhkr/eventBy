import React from 'react';

function Topbar() {
  return (
    <div className="relative">
        <div className=" relative flex items-center justify-between px-3 py-3 backdrop-blur-xl z-500 drop-shadow-xl bg-white m-2 rounded-3xl">
      {/* Left Section: User Profile */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            className="w-10 h-10 rounded-full shadow-md  object-cover" 
            src="https://avatars.githubusercontent.com/u/114610602?v=4&size=64" 
            alt="Profile" 
          />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-100 ring-2 ring-white"></span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800 leading-tight">
            Hello, <span className="text-purple-600">Sharad Rathor!</span>
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
    <div className="absolute w-full z-50 opacity-20 top-0 left-0 flex items-center justify-center blur-2xl">
        <div className="w-[30%] h-20 bg-purple-400"></div>
        <div className="w-[40%] h-20 skew-x-12 bg-pink-400"></div>
        <div className="w-[30%] h-20 skew-x-12 bg-yellow-400"></div>
      </div>
    </div>
  );
}

export default Topbar;
