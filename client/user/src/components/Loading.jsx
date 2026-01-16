import React from "react";
import loader from "../assets/loading.gif";

function Loading() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden
      bg-[#fcfefc]  animated-bg"
      role="status"
      aria-busy="true"
    >
      <img
        src={loader}
        alt="Loading"
        className="w-72 h-72 select-none pointer-events-none"
      />
    </div>
  );
}

export default Loading;
