import React from 'react';

const VantaBg = ({ children }) => {
  return (
    // 🌌 HIGH-CONTRAST AMBIENT HUB LAYER: Rock-solid deep grid color foundation
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 relative overflow-x-hidden isolate">
      
      {/* VECTOR A: Top-Left Blurred Sapphire Orb Aura (Stays crisp and scaled on mobile) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-125 max-h-125 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none select-none z-0 animate-pulse duration-5000" />
      
      {/* VECTOR B: Bottom-Right Blurred Purple Cyber Orb Aura */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-125 max-h-125 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none select-none z-0 animate-pulse duration-7000" />
      
      {/* APP SHEET CONTAINER VIEWPORT LAYOUT */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>

    </div>
  );
};

export default VantaBg;
