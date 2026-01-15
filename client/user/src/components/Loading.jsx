import React from "react";
import loader from "../assets/loading.mp4";

function Loading() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-[#fdfbff] via-[#f7f5ff] to-[#fff7f3] animated-bg"
      role="status"
      aria-busy="true"
    >
      <img
        src={loader}
        alt="Loading"
        className="w-32 h-32 md:w-40 md:h-40 select-none pointer-events-none"
      />
    </div>
  );
}

export default Loading;
