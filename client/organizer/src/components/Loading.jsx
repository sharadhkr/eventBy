import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Loading() {
  return (
    // 'flex items-center justify-center' centers the content
    // 'h-screen w-screen' ensures it covers the full viewport
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <DotLottieReact 
        src="https://lottie.host/3a6b4130-959c-4f93-b101-eca08e7593fc/4jgSAB1bFd.lottie" 
        loop 
        autoplay 
        className="w-64 h-64 md:w-96 md:h-96" // Responsive sizing
      />
    </div>
  );
}

export default Loading;
