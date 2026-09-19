import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const VantaBg = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    const vantaInit = typeof NET === 'function' ? NET : NET.default;

    if (!effectRef.current && myRef.current && typeof vantaInit === 'function') {
      try {
        effectRef.current = vantaInit({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x6366f1,
          backgroundColor: 0x030712,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 16.00
        });
        setVantaEffect(effectRef.current);
      } catch (err) {
        console.error("Vanta initialization failed:", err);
      }
    }

    return () => {
      if (effectRef.current) {
        const currentEffect = effectRef.current;
        setTimeout(() => {
          if (!myRef.current && currentEffect) {
            currentEffect.destroy();
          }
        }, 100);
      }
    };
  }, []);

  return (
    // FIXED: Changed min-h-screen to h-screen max-h-screen to pin the 3D grid firmly to the monitor boundaries
    <div 
      ref={myRef} 
      className="h-screen max-h-screen w-full max-w-full relative overflow-hidden bg-[#030712] text-slate-100"
    >
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* FIXED: Keeps individual dashboard views scrolling independently without pulling the background layer downwards */}
      <div className="relative z-10 w-full max-w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default VantaBg;
