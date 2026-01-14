import React from 'react';

const Background = () => {
  return (
    <div className="fixed -z-10  inset-0 w-lvh h-full bg-white">
      {/* This uses a CSS gradient to create thin, subtle lines.
          The lines are set to 5% black (slate-900) to keep them "light and thin".
      */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] pointer-events-none" />
    </div>
  );
};

export default Background;